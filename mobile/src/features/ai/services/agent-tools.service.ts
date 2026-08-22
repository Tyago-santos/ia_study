import { read } from '@/shared/services/db'
import { referenceFilesService, statsService } from '@/shared/services/dataStore'
import type { FunctionDeclaration } from '@/features/ai/types/ai.types'
import type { Subject, Topic } from '@/shared/types'

/**
 * Ferramentas que o agente pode chamar e o executor que roda cada uma.
 *
 * `AGENT_TOOLS` e' o contrato mandado ao Gemini; `executeTool` faz o trabalho —
 * aqui ele le' o banco local do aparelho (as mesmas materias e assuntos que a
 * tela Biblioteca mostra). No dia em que esses dados vierem do backend, muda so'
 * o corpo das funcoes deste arquivo.
 */

export const AGENT_TOOLS: FunctionDeclaration[] = [
  {
    name: 'list_subjects',
    description:
      'Lista as matérias cadastradas na Biblioteca do usuário, com a quantidade de assuntos ' +
      'e quantos já foram concluídos. Use para qualquer pergunta sobre o que ele estuda, ' +
      'quais matérias tem ou como está o progresso geral.',
  },
  {
    name: 'list_topics',
    description:
      'Lista os assuntos (tópicos) cadastrados dentro das matérias, com o estado de conclusão. ' +
      'Use para saber o que falta estudar, o que já foi concluído ou o conteúdo de uma matéria.',
    parameters: {
      type: 'OBJECT',
      properties: {
        subject: {
          type: 'STRING',
          description:
            'Nome da matéria para filtrar (aceita nome parcial). Omita para trazer de todas.',
        },
        status: {
          type: 'STRING',
          enum: ['todos', 'pendentes', 'concluidos'],
          description: 'Filtro de conclusão. O padrão é "todos".',
        },
      },
    },
  },
  {
    name: 'get_study_progress',
    description:
      'Resumo do esforço do usuário: minutos estudados hoje, na semana e no mês, sequência de ' +
      'dias, tempo por matéria e quanto material de estudo ele criou (flashcards, quizzes, ' +
      'resumos e mapas mentais). Use para perguntas sobre tempo estudado, ritmo ou dedicação.',
  },
  {
    name: 'list_reference_files',
    description:
      'Lista os arquivos de referência (PDF, imagem, .txt ou .md) que o usuário cadastrou na ' +
      'tela de Arquivos para consulta. Use antes de ler um arquivo específico, ou quando o ' +
      'usuário perguntar o que ele tem cadastrado.',
  },
  {
    name: 'read_reference_file',
    description:
      'Lê o conteúdo de um arquivo de referência cadastrado pelo usuário, pelo id devolvido por ' +
      'list_reference_files. Use quando a pergunta parecer precisar do conteúdo de um material ' +
      'específico, tipo "o que esse PDF diz sobre X" ou "resuma o arquivo Y".',
    parameters: {
      type: 'OBJECT',
      properties: {
        fileId: {
          type: 'STRING',
          description: 'id do arquivo, obtido via list_reference_files.',
        },
      },
      required: ['fileId'],
    },
  },
]

/** Roda uma tool call e devolve o objeto que volta ao modelo como resultado. */
export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  if (name === 'list_subjects') return listSubjects()
  if (name === 'list_topics') return listTopics(args)
  if (name === 'get_study_progress') return getStudyProgress()
  if (name === 'list_reference_files') return listReferenceFiles()
  if (name === 'read_reference_file') return readReferenceFile(args)

  return { error: `Ferramenta desconhecida: ${name}` }
}

/**
 * Bytes da imagem pedida nesta chamada, para `agent.service.ts` anexar como
 * imagem de verdade na mesma rodada (ver `InlineDataPart`). So' imagem tem
 * `base64` — PDF ja' teve o texto extraido na importacao e cai no branco de
 * texto do `readReferenceFile` abaixo.
 */
export async function getReferenceFileAttachment(
  fileId: string,
): Promise<{ mimeType: string; data: string } | null> {
  const file = await referenceFilesService.get(fileId)
  if (!file || !file.base64) return null
  return { mimeType: file.mimeType, data: file.base64 }
}

async function listSubjects(): Promise<Record<string, unknown>> {
  const { subjects, topics } = await read((db) => ({ subjects: db.subjects, topics: db.topics }))

  const materias = subjects.map((subject: Subject) => {
    const assuntos = topics.filter((t: Topic) => t.subjectId === subject.id)
    const concluidos = assuntos.filter((t: Topic) => t.completed).length

    return {
      nome: subject.name,
      assuntos: assuntos.length,
      assuntosConcluidos: concluidos,
      percentualConcluido: assuntos.length
        ? Math.round((concluidos / assuntos.length) * 100)
        : 0,
      criadaEm: subject.createdAt.slice(0, 10),
    }
  })

  return { total: materias.length, materias }
}

async function listTopics(args: Record<string, unknown>): Promise<Record<string, unknown>> {
  const filtroMateria = typeof args.subject === 'string' ? args.subject.trim().toLowerCase() : ''
  const status = typeof args.status === 'string' ? args.status : 'todos'

  const { subjects, topics } = await read((db) => ({ subjects: db.subjects, topics: db.topics }))

  const nomePorId = new Map(subjects.map((s: Subject) => [s.id, s.name]))

  // Nome parcial: o usuario escreve "calculo" e a materia se chama "Calculo I".
  const selecionadas = filtroMateria
    ? subjects.filter((s: Subject) => s.name.toLowerCase().includes(filtroMateria))
    : subjects

  if (filtroMateria && selecionadas.length === 0) {
    return {
      error: `Nenhuma matéria parecida com "${args.subject}".`,
      materiasDisponiveis: subjects.map((s: Subject) => s.name),
    }
  }

  const ids = new Set(selecionadas.map((s: Subject) => s.id))
  const assuntos = topics
    .filter((t: Topic) => ids.has(t.subjectId))
    .filter((t: Topic) =>
      status === 'pendentes' ? !t.completed : status === 'concluidos' ? t.completed : true,
    )
    .map((t: Topic) => ({
      materia: nomePorId.get(t.subjectId) ?? 'Sem matéria',
      assunto: t.name,
      concluido: t.completed,
    }))

  return { total: assuntos.length, filtro: { materia: args.subject ?? null, status }, assuntos }
}

async function getStudyProgress(): Promise<Record<string, unknown>> {
  const [dashboard, porMateria, quiz, materiais] = await Promise.all([
    statsService.dashboard(),
    statsService.subjects(),
    statsService.quiz(),
    read((db) => ({
      flashcards: db.flashcards.length,
      resumos: db.summaries.length,
      mapasMentais: db.mindMaps.length,
      eventosNoCronograma: db.events.length,
    })),
  ])

  return {
    minutosHoje: dashboard.todayMinutes,
    minutosNaSemana: dashboard.weekMinutes,
    minutosNoMes: dashboard.monthMinutes,
    sequenciaDeDias: dashboard.streak,
    tempoPorMateria: porMateria.map((s) => ({
      materia: s.subjectName,
      minutos: s.totalMinutes,
      sessoes: s.sessions,
    })),
    quizzes: { total: quiz.total, respondidos: quiz.completed, mediaDeAcertos: quiz.average },
    materiais,
  }
}

async function listReferenceFiles(): Promise<Record<string, unknown>> {
  const files = await referenceFilesService.list()

  return {
    total: files.length,
    arquivos: files.map((f) => ({
      id: f.id,
      nome: f.name,
      tipo: f.mimeType,
      tamanhoKB: Math.round(f.sizeBytes / 1024),
    })),
  }
}

async function readReferenceFile(args: Record<string, unknown>): Promise<Record<string, unknown>> {
  const fileId = typeof args.fileId === 'string' ? args.fileId : ''
  const file = fileId ? await referenceFilesService.get(fileId) : null

  if (!file) {
    return {
      error: `Arquivo "${fileId}" não encontrado. Use list_reference_files para ver os disponíveis.`,
    }
  }

  if (file.base64) {
    // Imagem: o conteudo real vai anexado a esta mesma rodada, nao aqui (ver
    // `getReferenceFileAttachment` + `InlineDataPart` em agent.service.ts).
    return { nome: file.name, tipo: file.mimeType, aviso: 'O arquivo foi anexado a esta mensagem.' }
  }

  return { nome: file.name, tipo: file.mimeType, texto: file.text ?? '' }
}
