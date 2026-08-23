/**
 * Camada de dados do app mobile.
 *
 * Biblioteca (materias/assuntos), flashcards e quizzes vivem no backend com o
 * banco local como espelho: le' do servidor quando da', do disco quando ele
 * nao responde, e o que for escrito offline entra numa fila reenviada depois
 * (ver `offlineFirst.ts`). As versoes `local*` sao a metade de disco disso,
 * exportadas para quem precisar so' do que ja esta no aparelho.
 *
 * Resumos, mapas mentais e configuracoes ainda sao so' locais — o backend nao
 * tem rota para eles. Cronograma e conversas do chat de IA seguem o mesmo
 * padrao servidor+espelho da Biblioteca; mensagens do chat, porem, exigem
 * rede de qualquer forma (a resposta vem do Gemini), entao nao entram na fila
 * de sync — ver comentario em `aiService` mais abaixo.
 *
 * Nada aqui vem semeado: o app abre vazio e cresce com o uso.
 */
import { createId } from '@/shared/lib/id'
import { read, write } from '@/shared/services/db'
import { conversationsApi, toChatMessage, toConversation } from '@/shared/services/conversationsApi'
import { flashcardsApi } from '@/shared/services/flashcardsApi'
import { subjectsApi, topicsApi } from '@/shared/services/libraryApi'
import {
  createThrough,
  isServerUnreachable,
  listThrough,
  mutateThrough,
} from '@/shared/services/offlineFirst'
import {
  type UpdatePlanBlockInput,
  plannerApi,
  toPlanBlock,
} from '@/shared/services/plannerApi'
import { quizzesApi } from '@/shared/services/quizzesApi'
import { scheduleApi, toScheduleEvent } from '@/shared/services/scheduleApi'
import { studySessionsApi } from '@/shared/services/studySessionsApi'
import type {
  ChatMessage,
  Conversation,
  DailyStats,
  Flashcard,
  MindMap,
  MindMapNode,
  Quiz,
  ReferenceFile,
  ScheduleEvent,
  StudySession,
  Subject,
  SubjectStats,
  Summary,
  Topic,
} from '@/shared/types'
import type { Database, StoredActivity, StoredPlanBlock } from '@/shared/services/db'

const now = () => new Date().toISOString()

/**
 * Registra o feito na timeline do dashboard. A lista fica limitada porque ela
 * so e exibida em pedacos de seis itens: guardar tudo faria o JSON gravado
 * crescer para sempre sem que ninguem visse a diferenca.
 */
const ACTIVITY_LIMIT = 50

function pushActivity(db: Database, activity: Omit<StoredActivity, 'id' | 'createdAt'>) {
  db.activities = [
    { id: createId('a'), createdAt: now(), ...activity },
    ...db.activities,
  ].slice(0, ACTIVITY_LIMIT)
}

// ------------------------------------------------------ materias e topicos

// Versoes locais (SQLite): ficam como fallback quando o servidor esta fora.
export const localSubjectsService = {
  list: () => read((db) => db.subjects),
  create: (input: { name: string; color: string; icon?: string }) =>
    write((db) => {
      const subject: Subject = { id: createId('s'), createdAt: now(), ...input }
      db.subjects = [...db.subjects, subject]
      return subject
    }),
  remove: (id: string) =>
    write((db) => {
      db.subjects = db.subjects.filter((s) => s.id !== id)
      db.topics = db.topics.filter((t) => t.subjectId !== id)
      return id
    }),
}

export const localTopicsService = {
  list: () => read((db) => db.topics),
  create: (input: { subjectId: string; name: string }) =>
    write((db) => {
      const topic: Topic = { id: createId('t'), completed: false, createdAt: now(), ...input }
      db.topics = [...db.topics, topic]
      return topic
    }),
  toggle: (id: string) =>
    write((db) => {
      db.topics = db.topics.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      return db.topics.find((t) => t.id === id)!
    }),
  remove: (id: string) =>
    write((db) => {
      db.topics = db.topics.filter((t) => t.id !== id)
      return id
    }),
}

/**
 * Versoes usadas pelas telas: servidor com o banco local por tras.
 *
 * Sao os mesmos nomes e assinaturas de quando tudo era local — quem chama nao
 * precisa saber de onde o dado veio. A mecanica esta em `offlineFirst.ts`.
 */
export const subjectsService = {
  list: () => listThrough('subjects', subjectsApi.list),

  create: (input: { name: string; color: string; icon?: string }) =>
    createThrough<Subject, 'subjects'>({
      key: 'subjects',
      draft: { id: createId('s'), createdAt: now(), ...input },
      remote: () => subjectsApi.create(input),
      payload: input,
      position: 'end',
      onLocalWrite: (db, subject) => {
        pushActivity(db, {
          type: 'subject',
          title: `Nova matéria: ${input.name}`,
          description: 'Matéria criada na biblioteca',
          subjectId: subject.id,
        })
      },
    }),

  remove: async (id: string) => {
    await mutateThrough({
      key: 'subjects',
      id,
      action: 'remove',
      applyLocal: (db) => {
        db.subjects = db.subjects.filter((s) => s.id !== id)
        // Os assuntos morrem junto com a materia (o servidor faz o mesmo em cascata).
        db.topics = db.topics.filter((t) => t.subjectId !== id)
      },
      remote: () => subjectsApi.remove(id),
      payload: id,
    })
    return id
  },
}

export const topicsService = {
  list: () => listThrough('topics', topicsApi.list),

  create: (input: { subjectId: string; name: string }) =>
    createThrough<Topic, 'topics'>({
      key: 'topics',
      draft: { id: createId('t'), completed: false, createdAt: now(), ...input },
      remote: () => topicsApi.create(input),
      payload: input,
      position: 'end',
      onLocalWrite: (db) => {
        const subjectName = db.subjects.find((s) => s.id === input.subjectId)?.name ?? 'Estudo'
        pushActivity(db, {
          type: 'topic',
          title: `Novo assunto: ${input.name}`,
          description: subjectName,
          subjectId: input.subjectId,
        })
      },
    }),

  toggle: async (id: string) => {
    await mutateThrough({
      key: 'topics',
      id,
      action: 'toggle',
      applyLocal: (db) => {
        db.topics = db.topics.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))

        // So concluir vale linha na timeline; desmarcar nao e' progresso.
        const topic = db.topics.find((t) => t.id === id)
        if (!topic?.completed) return

        const subjectName = db.subjects.find((s) => s.id === topic.subjectId)?.name ?? 'Estudo'
        pushActivity(db, {
          type: 'topic',
          title: `Assunto concluído: ${topic.name}`,
          description: subjectName,
          subjectId: topic.subjectId,
        })
      },
      remote: () => topicsApi.toggle(id),
      payload: id,
    })
    return read((db) => db.topics.find((t) => t.id === id)!)
  },

  remove: async (id: string) => {
    await mutateThrough({
      key: 'topics',
      id,
      action: 'remove',
      applyLocal: (db) => {
        db.topics = db.topics.filter((t) => t.id !== id)
      },
      remote: () => topicsApi.remove(id),
      payload: id,
    })
    return id
  },
}

// -------------------------------------------------------------- flashcards

export const localFlashcardsService = {
  list: (subjectId?: string) =>
    read((db) => (subjectId ? db.flashcards.filter((f) => f.subjectId === subjectId) : db.flashcards)),
  create: (input: {
    subjectId: string
    front: string
    back: string
    difficulty: Flashcard['difficulty']
  }) =>
    write((db) => {
      const flashcard: Flashcard = {
        id: createId('fc'),
        nextReview: now(),
        reviewCount: 0,
        createdAt: now(),
        ...input,
      }
      db.flashcards = [flashcard, ...db.flashcards]

      const subjectName = db.subjects.find((s) => s.id === input.subjectId)?.name ?? 'Estudo'
      pushActivity(db, {
        type: 'flashcard',
        title: 'Novo flashcard',
        description: `${subjectName} - ${input.front}`,
        subjectId: input.subjectId,
      })

      return flashcard
    }),
  remove: (id: string) =>
    write((db) => {
      db.flashcards = db.flashcards.filter((f) => f.id !== id)
      return id
    }),
}

export const flashcardsService = {
  list: (subjectId?: string) =>
    subjectId
      ? listThrough('flashcards', () => flashcardsApi.list(subjectId))
      : listThrough('flashcards', flashcardsApi.list),

  create: (input: {
    subjectId: string
    front: string
    back: string
    difficulty: Flashcard['difficulty']
  }) =>
    createThrough<Flashcard, 'flashcards'>({
      key: 'flashcards',
      draft: {
        id: createId('fc'),
        nextReview: now(),
        reviewCount: 0,
        createdAt: now(),
        ...input,
      },
      remote: () => flashcardsApi.create(input),
      payload: input,
      onLocalWrite: (db) => {
        const subjectName = db.subjects.find((s) => s.id === input.subjectId)?.name ?? 'Estudo'
        pushActivity(db, {
          type: 'flashcard',
          title: 'Novo flashcard',
          description: `${subjectName} - ${input.front}`,
          subjectId: input.subjectId,
        })
      },
    }),

  remove: async (id: string) => {
    await mutateThrough({
      key: 'flashcards',
      id,
      action: 'remove',
      applyLocal: (db) => {
        db.flashcards = db.flashcards.filter((f) => f.id !== id)
      },
      remote: () => flashcardsApi.remove(id),
      payload: id,
    })
    return id
  },
}

// -------------------------------------------------------------------- quiz

export const localQuizService = {
  list: (subjectId?: string) =>
    read((db) => (subjectId ? db.quizzes.filter((q) => q.subjectId === subjectId) : db.quizzes)),
  create: (input: { subjectId: string; title: string; questions: Quiz['questions'] }) =>
    write((db) => {
      const quiz: Quiz = { id: createId('q'), createdAt: now(), ...input }
      db.quizzes = [quiz, ...db.quizzes]
      return quiz
    }),
  remove: (id: string) =>
    write((db) => {
      db.quizzes = db.quizzes.filter((q) => q.id !== id)
      return id
    }),
  submit: (input: { quizId: string; answers: Record<string, number> }) =>
    write((db) => {
      const quiz = db.quizzes.find((q) => q.id === input.quizId)
      if (!quiz) throw new Error('Quiz não encontrado')

      const questions = quiz.questions.map((q) => ({ ...q, userAnswer: input.answers[q.id] }))
      const correct = questions.filter((q) => q.userAnswer === q.correctAnswer).length
      const score = Math.round((correct / questions.length) * 100)

      const updated: Quiz = { ...quiz, questions, score, completedAt: now() }
      db.quizzes = db.quizzes.map((q) => (q.id === quiz.id ? updated : q))

      pushActivity(db, {
        type: 'quiz',
        title: quiz.title,
        description: `Score: ${score}%`,
        subjectId: quiz.subjectId,
      })

      return { score, correct, total: questions.length }
    }),
}

export const quizService = {
  list: (subjectId?: string) =>
    subjectId
      ? listThrough('quizzes', () => quizzesApi.list(subjectId))
      : listThrough('quizzes', quizzesApi.list),

  create: (input: { subjectId: string; title: string; questions: Quiz['questions'] }) =>
    createThrough<Quiz, 'quizzes'>({
      key: 'quizzes',
      draft: { id: createId('q'), createdAt: now(), ...input },
      remote: () => quizzesApi.create(input),
      payload: input,
    }),

  remove: async (id: string) => {
    await mutateThrough({
      key: 'quizzes',
      id,
      action: 'remove',
      applyLocal: (db) => {
        db.quizzes = db.quizzes.filter((q) => q.id !== id)
      },
      remote: () => quizzesApi.remove(id),
      payload: id,
    })
    return id
  },

  /**
   * A nota sai da correcao local para a tela nao ficar esperando a rede — o
   * gabarito ja esta no aparelho, entao o resultado e' o mesmo que o servidor
   * calcularia. A ida ao servidor serve para gravar a nota (e entra na fila se
   * ele estiver fora).
   */
  submit: async (input: { quizId: string; answers: Record<string, number> }) => {
    let result: { score: number; correct: number; total: number } | null = null

    await mutateThrough({
      key: 'quizzes',
      id: input.quizId,
      action: 'submit',
      applyLocal: (db) => {
        const quiz = db.quizzes.find((q) => q.id === input.quizId)
        if (!quiz) throw new Error('Quiz não encontrado')

        const questions = quiz.questions.map((q) => ({ ...q, userAnswer: input.answers[q.id] }))
        const correct = questions.filter((q) => q.userAnswer === q.correctAnswer).length
        const score = Math.round((correct / questions.length) * 100)

        db.quizzes = db.quizzes.map((q) =>
          q.id === quiz.id ? { ...quiz, questions, score, completedAt: now() } : q,
        )

        pushActivity(db, {
          type: 'quiz',
          title: quiz.title,
          description: `Score: ${score}%`,
          subjectId: quiz.subjectId,
        })

        result = { score, correct, total: questions.length }
      },
      remote: () => quizzesApi.submit(input),
      payload: input,
    })

    return result!
  },
}

// ----------------------------------------------------------------- resumos

export const summariesService = {
  list: () => read((db) => db.summaries),
  create: (input: {
    subjectId: string
    title: string
    content: string
    sourceType: Summary['sourceType']
  }) =>
    write((db) => {
      const summary: Summary = { id: createId('r'), createdAt: now(), ...input }
      db.summaries = [summary, ...db.summaries]

      pushActivity(db, {
        type: 'summary',
        title: `Resumo: ${input.title}`,
        description: 'Resumo criado',
        subjectId: input.subjectId,
      })

      return summary
    }),
  remove: (id: string) =>
    write((db) => {
      db.summaries = db.summaries.filter((s) => s.id !== id)
      return id
    }),
}

// ----------------------------------------------------------- mapas mentais

export const mindMapsService = {
  list: () => read((db) => db.mindMaps),
  create: (input: { subjectId: string; title: string; description?: string }) =>
    write((db) => {
      const rootId = createId('mmn')
      const mindMap: MindMap = {
        id: createId('mm'),
        createdAt: now(),
        updatedAt: now(),
        nodes: [{ id: rootId, parentId: null, label: input.title }],
        ...input,
      }
      db.mindMaps = [mindMap, ...db.mindMaps]
      return mindMap
    }),
  remove: (id: string) =>
    write((db) => {
      db.mindMaps = db.mindMaps.filter((m) => m.id !== id)
      return id
    }),
  addNode: (input: {
    mapId: string
    parentId: string
    label: string
    note?: string
    color?: string
  }) =>
    write((db) => {
      const node: MindMapNode = {
        id: createId('mmn'),
        parentId: input.parentId,
        label: input.label,
        note: input.note,
        color: input.color || undefined,
      }
      db.mindMaps = db.mindMaps.map((m) =>
        m.id === input.mapId ? { ...m, nodes: [...m.nodes, node], updatedAt: now() } : m,
      )
      return node
    }),
  /** Edita rotulo e/ou resumo de um no; campos ausentes ficam como estao. */
  updateNode: (input: {
    mapId: string
    nodeId: string
    label?: string
    note?: string
    color?: string | null
  }) =>
    write((db) => {
      db.mindMaps = db.mindMaps.map((m) =>
        m.id === input.mapId
          ? {
              ...m,
              nodes: m.nodes.map((n) =>
                n.id === input.nodeId
                  ? {
                      ...n,
                      label: input.label ?? n.label,
                      // String vazia limpa o resumo; `undefined` preserva.
                      note: input.note === undefined ? n.note : input.note || undefined,
                      color: input.color === undefined ? n.color : input.color || undefined,
                    }
                  : n,
              ),
              updatedAt: now(),
            }
          : m,
      )
      return input.nodeId
    }),

  removeNode: (input: { mapId: string; nodeId: string }) =>
    write((db) => {
      const map = db.mindMaps.find((m) => m.id === input.mapId)
      if (!map) return input.nodeId

      // Um no removido leva a subarvore inteira: sem isso os filhos ficariam orfaos.
      const doomed = new Set([input.nodeId])
      let changed = true
      while (changed) {
        changed = false
        for (const node of map.nodes) {
          if (node.parentId && doomed.has(node.parentId) && !doomed.has(node.id)) {
            doomed.add(node.id)
            changed = true
          }
        }
      }

      db.mindMaps = db.mindMaps.map((m) =>
        m.id === input.mapId
          ? { ...m, nodes: m.nodes.filter((n) => !doomed.has(n.id)), updatedAt: now() }
          : m,
      )
      return input.nodeId
    }),
}

// -------------------------------------------------------------- cronograma

/**
 * Muda a data de um evento no fuso do aparelho e sobe a data pronta.
 *
 * O calculo nao pode ir pro servidor: la' e' UTC, e um evento das 21h no
 * Brasil viraria o dia seguinte. Aqui `new Date` e `getDay` usam o fuso de
 * quem esta com o app na mao, que e' o que o usuario ve na tela.
 */
async function reschedule(id: string, nextDate: (current: Date) => Date): Promise<string> {
  const event = await read((db) => db.events.find((e) => e.id === id))
  if (!event) return id

  const date = nextDate(new Date(event.date)).toISOString()

  await mutateThrough({
    key: 'events',
    id,
    action: 'update',
    applyLocal: (db) => {
      db.events = db.events.map((e) => (e.id === id ? { ...e, date } : e))
    },
    remote: () => scheduleApi.update(id, { date }),
    payload: { id, date },
  })

  return id
}

export const scheduleService = {
  list: async () => {
    const events = await listThrough('events', async () =>
      (await scheduleApi.list()).map(toScheduleEvent),
    )
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },

  create: (input: {
    title: string
    type: ScheduleEvent['type']
    date: string
    durationMinutes?: number
    subjectId?: string
    description?: string
  }) =>
    createThrough<ScheduleEvent, 'events'>({
      key: 'events',
      draft: { id: createId('ev'), completed: false, createdAt: now(), ...input },
      remote: async () => toScheduleEvent(await scheduleApi.create(input)),
      payload: input,
      position: 'end',
    }),

  toggle: async (id: string) => {
    await mutateThrough({
      key: 'events',
      id,
      action: 'toggle',
      applyLocal: (db) => {
        db.events = db.events.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
      },
      remote: () => scheduleApi.toggle(id),
      payload: id,
    })
    return read((db) => db.events.find((e) => e.id === id)!)
  },

  /**
   * Tira o compromisso da semana corrente empurrando-o sete dias. Nao apaga o
   * evento: ele tem data real e some do planner voltando para a paleta, de onde
   * pode ser arrastado de volta.
   */
  postponeWeek: (id: string) =>
    reschedule(id, (current) => {
      const next = new Date(current)
      next.setDate(next.getDate() + 7)
      return next
    }),

  /**
   * Move o evento para um dia da semana corrente, preservando o horario. Usado
   * quando um compromisso e arrastado para um dia no planner semanal.
   */
  moveToWeekday: (input: { id: string; weekday: number }) =>
    reschedule(input.id, (current) => {
      const target = new Date()
      target.setHours(current.getHours(), current.getMinutes(), 0, 0)
      target.setDate(target.getDate() - target.getDay() + input.weekday)
      return target
    }),

  remove: async (id: string) => {
    await mutateThrough({
      key: 'events',
      id,
      action: 'remove',
      applyLocal: (db) => {
        db.events = db.events.filter((e) => e.id !== id)
      },
      remote: () => scheduleApi.remove(id),
      payload: id,
    })
    return id
  },
}

// ------------------------------------------------------- planner semanal

/**
 * Blocos da semana modelo. O servidor guarda a lista achatada com `weekday`;
 * a tela agrupa por dia (ver `useWeeklyPlanner`).
 */
export const plannerService = {
  blocks: () =>
    listThrough('planBlocks', async () => {
      const week = await plannerApi.week()

      // A meta vem no mesmo GET: aproveita para espelhar junto, senao a tela
      // precisaria de uma segunda chamada so' para ela.
      await write((db) => {
        db.weeklyGoalMinutes = week.weeklyGoalMinutes
      })

      return week.blocks.map((block) => ({ ...toPlanBlock(block), weekday: block.weekday }))
    }),

  weeklyGoal: () => read((db) => db.weeklyGoalMinutes),

  setWeeklyGoal: async (weeklyGoalMinutes: number) => {
    await mutateThrough({
      key: 'planBlocks',
      id: 'goal',
      action: 'update',
      applyLocal: (db) => {
        db.weeklyGoalMinutes = weeklyGoalMinutes
      },
      remote: () => plannerApi.setGoal(weeklyGoalMinutes),
      payload: { goal: weeklyGoalMinutes },
    })
    return weeklyGoalMinutes
  },

  addBlock: (input: {
    weekday: number
    subjectId: string
    subjectName: string
    subjectColor: string
    duration: number
  }) =>
    createThrough<StoredPlanBlock, 'planBlocks'>({
      key: 'planBlocks',
      draft: { id: createId('blk'), ...input },
      remote: async () => {
        const saved = await plannerApi.createBlock(input)
        return { ...toPlanBlock(saved), weekday: saved.weekday }
      },
      payload: input,
      position: 'end',
    }),

  /** Serve para arrastar de dia (`weekday`) e para editar duracao/horario/assunto. */
  updateBlock: async (id: string, patch: UpdatePlanBlockInput) => {
    await mutateThrough({
      key: 'planBlocks',
      id,
      action: 'update',
      applyLocal: (db) => {
        db.planBlocks = db.planBlocks.map((block) =>
          block.id === id ? applyBlockPatch(block, patch) : block,
        )
      },
      remote: () => plannerApi.updateBlock(id, patch),
      payload: { id, ...patch },
    })
    return id
  },

  removeBlock: async (id: string) => {
    await mutateThrough({
      key: 'planBlocks',
      id,
      action: 'remove',
      applyLocal: (db) => {
        db.planBlocks = db.planBlocks.filter((block) => block.id !== id)
      },
      remote: () => plannerApi.removeBlock(id),
      payload: id,
    })
    return id
  },
}

/** `null` no patch limpa o campo; `undefined` deixa como esta. */
function applyBlockPatch(block: StoredPlanBlock, patch: UpdatePlanBlockInput): StoredPlanBlock {
  const next = { ...block }

  if (patch.weekday !== undefined) next.weekday = patch.weekday
  if (patch.duration !== undefined) next.duration = patch.duration

  if (patch.startTime === null) delete next.startTime
  else if (patch.startTime !== undefined) next.startTime = patch.startTime

  if (patch.topicId === null) delete next.topicId
  else if (patch.topicId !== undefined) next.topicId = patch.topicId

  if (patch.topicName === null) delete next.topicName
  else if (patch.topicName !== undefined) next.topicName = patch.topicName

  return next
}

// ---------------------------------------------------------------- chat IA

/**
 * Conversas vivem no backend (uma por sessao, cada uma com seu proprio
 * historico isolado das demais) com o banco local como espelho, igual ao
 * cronograma e a Biblioteca.
 *
 * Mensagens sao a excecao: gravar uma so acontece quando ha rede, porque a
 * resposta do assistente vem do Gemini (`runAgent`, em `features/ai`) — sem
 * rede a pergunta inteira falha antes de qualquer coisa ser gravada, entao
 * nao ha "mensagem offline" para enfileirar. `listMessages` cai no espelho
 * local so' para leitura, quando o servidor nao responde.
 */
export const aiService = {
  listConversations: () =>
    listThrough('conversations', async () => (await conversationsApi.list()).map(toConversation)),

  createConversation: (title = 'Nova conversa') =>
    createThrough<Conversation, 'conversations'>({
      key: 'conversations',
      draft: { id: createId('c'), title, messages: [], createdAt: now(), updatedAt: now() },
      remote: async () => toConversation(await conversationsApi.create(title)),
      payload: { title },
    }),

  renameConversation: async (input: { id: string; title: string }) => {
    await mutateThrough({
      key: 'conversations',
      id: input.id,
      action: 'update',
      applyLocal: (db) => {
        db.conversations = db.conversations.map((c) =>
          c.id === input.id ? { ...c, title: input.title, updatedAt: now() } : c,
        )
      },
      remote: () => conversationsApi.rename(input.id, input.title),
      payload: input,
    })
    return input.id
  },

  deleteConversation: async (id: string) => {
    await mutateThrough({
      key: 'conversations',
      id,
      action: 'remove',
      applyLocal: (db) => {
        db.conversations = db.conversations.filter((c) => c.id !== id)
      },
      remote: () => conversationsApi.remove(id),
      payload: id,
    })
    return id
  },

  listMessages: async (conversationId: string) => {
    try {
      const messages = (await conversationsApi.listMessages(conversationId)).map(toChatMessage)
      await write((db) => {
        db.conversations = db.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages } : c,
        )
      })
      return messages
    } catch (error) {
      if (!isServerUnreachable(error)) throw error
      return read((db) => db.conversations.find((c) => c.id === conversationId)?.messages ?? [])
    }
  },

  /**
   * Acrescenta uma mensagem a conversa. A pergunta e gravada antes da chamada
   * ao modelo: se a resposta falhar, o que o usuario escreveu nao se perde.
   *
   * A primeira pergunta tambem vira o titulo, que ate entao era "Nova
   * conversa" — o servidor aplica a mesma regra e devolve so' a mensagem, por
   * isso o titulo e' recalculado aqui tambem para o espelho local nao ficar
   * defasado ate o proximo `listConversations`.
   */
  addMessage: async (input: { conversationId: string; content: string; role: ChatMessage['role'] }) => {
    const message = toChatMessage(
      await conversationsApi.addMessage(input.conversationId, {
        role: input.role,
        content: input.content,
      }),
    )

    await write((db) => {
      db.conversations = db.conversations.map((c) => {
        if (c.id !== input.conversationId) return c

        const isFirstQuestion = input.role === 'user' && c.messages.length === 0
        return {
          ...c,
          title: isFirstQuestion ? titleFrom(input.content) : c.title,
          messages: [...c.messages, message],
          updatedAt: now(),
        }
      })
    })

    return message
  },

  /** Apaga as mensagens da conversa, que continua existindo (e reutilizavel). */
  clearMessages: async (conversationId: string) => {
    await conversationsApi.clearMessages(conversationId)
    await write((db) => {
      db.conversations = db.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [], updatedAt: now() } : c,
      )
    })
    return conversationId
  },
}

/** Titulo curto o bastante para caber numa linha da lista de conversas. */
const TITLE_LIMIT = 40

function titleFrom(content: string): string {
  const clean = content.trim().replace(/\s+/g, ' ')
  return clean.length > TITLE_LIMIT ? `${clean.slice(0, TITLE_LIMIT).trimEnd()}...` : clean
}

// -------------------------------------------------------- arquivos de IA

/**
 * Arquivos que o usuario cadastra para o agente consultar sob demanda (ver
 * `read_reference_file` em `features/ai/services/agent-tools.service.ts`).
 * Ficam no banco local igual ao resto: nada e enviado a lugar nenhum ate o
 * proprio agente pedir, dentro de uma conversa.
 */
export const referenceFilesService = {
  list: () => read((db) => db.referenceFiles),
  get: (id: string) => read((db) => db.referenceFiles.find((f) => f.id === id) ?? null),
  create: (input: {
    name: string
    mimeType: ReferenceFile['mimeType']
    sizeBytes: number
    text?: string
    base64?: string
  }) =>
    write((db) => {
      const file: ReferenceFile = { id: createId('rf'), createdAt: now(), ...input }
      db.referenceFiles = [file, ...db.referenceFiles]
      return file
    }),
  remove: (id: string) =>
    write((db) => {
      db.referenceFiles = db.referenceFiles.filter((f) => f.id !== id)
      return id
    }),
}

// --------------------------------------------------------------- pomodoro

export const pomodoroService = {
  listSessions: () => read((db) => db.sessions),

  /** Registra uma sessao concluida e credita a atividade na timeline. */
  finish: async (input: { subjectId: string; minutes: number; type: StudySession['type'] }) => {
    const subjectName = await read(
      (db) => db.subjects.find((s) => s.id === input.subjectId)?.name ?? 'Estudo',
    )

    const session = await write((db) => {
      const completedAt = now()
      const startedAt = new Date(Date.now() - input.minutes * 60_000).toISOString()

      const session: StudySession = {
        id: createId('ss'),
        subjectId: input.subjectId,
        duration: input.minutes,
        startedAt,
        completedAt,
        type: input.type,
      }
      db.sessions = [session, ...db.sessions]

      pushActivity(db, {
        type: 'pomodoro',
        title: `Sessão de ${subjectName}`,
        description: `${input.minutes} min - ${subjectName}`,
        subjectId: input.subjectId,
      })

      return session
    })

    // Best-effort: o dashboard e a sequencia vivem no backend agora, mas uma
    // sessao offline nao pode se perder — ela ja esta salva localmente acima.
    studySessionsApi
      .create({ subjectId: input.subjectId, subjectName, duration: input.minutes, type: input.type })
      .catch((error) => console.error('[study-sessions] falha ao sincronizar sessao', error))

    return session
  },
}

// ------------------------------------------------------------ estatisticas

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * Chave "AAAA-MM-DD" no fuso do aparelho.
 *
 * Tem que ser local, e nao UTC: as telas remontam a data com
 * `new Date(`${chave}T00:00:00`)`, que e lido como local. Uma sessao das 21h
 * no Brasil cairia no dia seguinte se a chave saisse do `toISOString()`.
 */
function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

interface DayTotals {
  minutes: number
  pomodoros: number
}

function totalsByDay(sessions: StudySession[]): Map<string, DayTotals> {
  const totals = new Map<string, DayTotals>()

  for (const session of sessions) {
    const key = dayKey(new Date(session.completedAt))
    const current = totals.get(key) ?? { minutes: 0, pomodoros: 0 }

    totals.set(key, {
      minutes: current.minutes + session.duration,
      pomodoros: current.pomodoros + (session.type === 'pomodoro' ? 1 : 0),
    })
  }

  return totals
}

/** Serie diaria continua terminando hoje — dias sem estudo entram zerados. */
function series(totals: Map<string, DayTotals>, days: number): DailyStats[] {
  const result: DailyStats[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() - (days - 1))

  for (let i = 0; i < days; i++) {
    const key = dayKey(cursor)
    const totalsOfDay = totals.get(key) ?? { minutes: 0, pomodoros: 0 }
    result.push({ date: key, ...totalsOfDay })
    cursor.setDate(cursor.getDate() + 1)
  }

  return result
}

/**
 * Dias seguidos de estudo contados de tras para frente.
 *
 * O dia de hoje nao quebra a sequencia enquanto ainda esta em aberto: quem
 * estudou ontem e abre o app de manha continua com a ofensiva de pe.
 */
function streakOf(totals: Map<string, DayTotals>): number {
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  if (!totals.get(dayKey(cursor))?.minutes) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (totals.get(dayKey(cursor))?.minutes) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function sumMinutes(days: DailyStats[]): number {
  return days.reduce((total, day) => total + day.minutes, 0)
}

/** Quantos dias cobrem o calendario de contribuicoes comecando num domingo. */
const CALENDAR_WEEKS = 20

export const statsService = {
  dashboard: () =>
    read((db) => {
      const totals = totalsByDay(db.sessions)

      return {
        todayMinutes: totals.get(dayKey(new Date()))?.minutes ?? 0,
        weekMinutes: sumMinutes(series(totals, 7)),
        monthMinutes: sumMinutes(series(totals, 30)),
        streak: streakOf(totals),
      }
    }),

  weekly: (): Promise<DailyStats[]> => read((db) => series(totalsByDay(db.sessions), 7)),

  subjects: (): Promise<SubjectStats[]> =>
    read((db) => {
      const totals = new Map<string, SubjectStats>()

      for (const session of db.sessions) {
        const subject = db.subjects.find((s) => s.id === session.subjectId)
        const current = totals.get(session.subjectId) ?? {
          subjectId: session.subjectId,
          subjectName: subject?.name ?? 'Sem matéria',
          totalMinutes: 0,
          sessions: 0,
        }

        totals.set(session.subjectId, {
          ...current,
          totalMinutes: current.totalMinutes + session.duration,
          sessions: current.sessions + 1,
        })
      }

      return [...totals.values()].sort((a, b) => b.totalMinutes - a.totalMinutes)
    }),

  contributions: (): Promise<DailyStats[]> =>
    read((db) => {
      // Fecha a serie no ultimo sabado para que cada coluna do calendario seja
      // uma semana inteira de domingo a sabado, como no grafico do GitHub.
      const daysIntoWeek = new Date().getDay()
      return series(totalsByDay(db.sessions), (CALENDAR_WEEKS - 1) * 7 + daysIntoWeek + 1)
    }),

  activities: () => read((db) => db.activities),

  quiz: () =>
    read((db) => {
      const completed = db.quizzes.filter((q) => q.score !== undefined)
      const average = completed.length
        ? Math.round(completed.reduce((sum, q) => sum + (q.score ?? 0), 0) / completed.length)
        : 0
      return { average, total: db.quizzes.length, completed: completed.length }
    }),

  flashcards: () => read((db) => ({ total: db.flashcards.length })),

  pomodoro: () =>
    read((db) => ({
      totalPomodoros: db.sessions.filter((s) => s.type === 'pomodoro').length,
    })),
}

// ---------------------------------------------------------- configuracoes

export const settingsService = {
  get: () => read((db) => db.settings),
  update: (patch: Partial<Database['settings']>) =>
    write((db) => {
      db.settings = { ...db.settings, ...patch }
      return db.settings
    }),
}
