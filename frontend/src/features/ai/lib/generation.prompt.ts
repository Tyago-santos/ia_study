import { GENERATION_SIZES, type GenerationKind } from '@/features/ai/schemas/generation.schema'
import type { Subject, Topic } from '@/shared/types'

/**
 * O texto que pede o material de estudo. Mesmo texto usado no app mobile
 * (`mobile/src/features/ai/libs/generation.prompt.ts`).
 */

export const GENERATION_SYSTEM_PROMPT = `Você é um professor que prepara material de estudo em português do Brasil.

Regras:
- Escreva para quem está estudando o assunto agora: linguagem clara, sem enrolação.
- Cubra os assuntos informados. Se não houver assuntos listados, cubra os fundamentos da matéria.
- Priorize os assuntos marcados como pendentes: é neles que a pessoa precisa de ajuda.
- Não invente dados sobre a pessoa. Você só recebeu o nome da matéria e a lista de assuntos.
- Gere apenas o que foi pedido nesta mensagem, nada além.`

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
  /** Foco pontual digitado pelo usuario na hora (nao vem da Biblioteca). */
  focus?: string
}

function buildContext({ subject, topics, focus }: GenerationInput): string[] {
  const pending = topics.filter((topic) => !topic.completed).map((topic) => topic.name)
  const done = topics.filter((topic) => topic.completed).map((topic) => topic.name)

  const lines = [`Matéria: ${subject.name}`]

  if (pending.length > 0) lines.push(`Assuntos pendentes (prioridade): ${pending.join(', ')}`)
  if (done.length > 0) lines.push(`Assuntos já concluídos (revisão): ${done.join(', ')}`)
  if (topics.length === 0) {
    lines.push('Nenhum assunto cadastrado — cubra os fundamentos da matéria.')
  }
  if (focus?.trim()) lines.push(`Foco pedido agora: ${focus.trim()}`)

  return lines
}

export function buildGenerationPrompt(kind: GenerationKind, input: GenerationInput): string {
  return [...buildContext(input), '', KIND_INSTRUCTIONS[kind]].join('\n')
}
