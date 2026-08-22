import { GENERATION_SIZES, type GenerationKind } from '@/features/ai/schemas/generation.schema'
import type { Subject, Topic } from '@/shared/types'

/**
 * O texto que pede o material de estudo.
 *
 * Mora aqui, longe do servico, porque e' o pedaco que mais muda com o produto e
 * o unico que da' para conferir sozinho — sem banco, sem rede.
 */

export const GENERATION_SYSTEM_PROMPT = `Você é um professor que prepara material de estudo em português do Brasil.

Regras:
- Escreva para quem está estudando o assunto agora: linguagem clara, sem enrolação.
- Cubra os assuntos informados. Se não houver assuntos listados, cubra os fundamentos da matéria.
- Priorize os assuntos marcados como pendentes: é neles que a pessoa precisa de ajuda.
- Não invente dados sobre a pessoa. Você só recebeu o nome da matéria e a lista de assuntos.
- Gere apenas o que foi pedido nesta mensagem, nada além.`

/** A instrucao final, especifica do que esta sendo gerado. */
const KIND_INSTRUCTIONS: Record<GenerationKind, string> = {
  summary:
    'Escreva um resumo de estudo desta matéria. Comece pela ideia central e desça para os detalhes.',
  flashcards:
    `Crie de ${GENERATION_SIZES.flashcards.min} a ${GENERATION_SIZES.flashcards.max} flashcards: ` +
    'uma pergunta objetiva na frente, resposta curta no verso. Varie o que é cobrado — nada de ' +
    '"o que é X?" repetido cartão após cartão.',
  mindMap:
    'Monte um mapa mental do conteúdo. Os ramos são os grandes blocos da matéria; os sub-ramos ' +
    'são conceitos concretos, em poucas palavras, não frases inteiras.',
  quiz:
    `Monte um quiz de múltipla escolha com ${GENERATION_SIZES.questions.min} a ` +
    `${GENERATION_SIZES.questions.max} questões. As alternativas devem ser plausíveis entre si: ` +
    'nada de alternativa obviamente absurda, e só uma correta.',
}

export interface GenerationInput {
  subject: Subject
  topics: Topic[]
}

/** Contexto comum: a materia da Biblioteca e a situacao dos assuntos dela. */
function buildContext({ subject, topics }: GenerationInput): string[] {
  const pending = topics.filter((topic) => !topic.completed).map((topic) => topic.name)
  const done = topics.filter((topic) => topic.completed).map((topic) => topic.name)

  const lines = [`Matéria: ${subject.name}`]

  if (pending.length > 0) lines.push(`Assuntos pendentes (prioridade): ${pending.join(', ')}`)
  if (done.length > 0) lines.push(`Assuntos já concluídos (revisão): ${done.join(', ')}`)
  if (topics.length === 0) {
    lines.push('Nenhum assunto cadastrado — cubra os fundamentos da matéria.')
  }

  return lines
}

export function buildGenerationPrompt(kind: GenerationKind, input: GenerationInput): string {
  return [...buildContext(input), '', KIND_INSTRUCTIONS[kind]].join('\n')
}
