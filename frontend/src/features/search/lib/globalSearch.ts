import type { Flashcard, MindMap, Quiz, Subject, Summary, Topic } from '@/shared/types'

export type SearchResultKind = 'subject' | 'topic' | 'summary' | 'flashcard' | 'quiz' | 'mindmap'

export interface SearchResult {
  /** Unico dentro da lista inteira: o mesmo id pode existir em dois tipos. */
  key: string
  kind: SearchResultKind
  title: string
  /** Matéria a que o item pertence, quando existe. */
  context?: string
  /** Cor da matéria, usada como marcador do resultado. */
  color?: string
  to: SearchRoute
  score: number
}

export interface SearchGroup {
  kind: SearchResultKind
  label: string
  results: SearchResult[]
}

/**
 * A ordem em que os grupos aparecem. Matéria e assunto vem primeiro porque sao
 * o vocabulario que o aluno usa para pensar; os artefatos vem depois.
 */
const KIND_ORDER: SearchResultKind[] = [
  'subject',
  'topic',
  'summary',
  'flashcard',
  'quiz',
  'mindmap',
]

const KIND_LABELS: Record<SearchResultKind, string> = {
  subject: 'Matérias',
  topic: 'Assuntos',
  summary: 'Resumos',
  flashcard: 'Flashcards',
  quiz: 'Quizzes',
  mindmap: 'Mapas mentais',
}

const KIND_ROUTES = {
  subject: '/biblioteca',
  topic: '/biblioteca',
  summary: '/resumos',
  flashcard: '/flashcards',
  quiz: '/quiz',
  mindmap: '/mapas-mentais',
} as const satisfies Record<SearchResultKind, string>

/** As rotas literais que a busca pode abrir — mantém `navigate` tipado. */
export type SearchRoute = (typeof KIND_ROUTES)[SearchResultKind]

/** Teto de resultados por grupo: a lista serve para escolher, nao para navegar. */
const MAX_PER_GROUP = 4

/**
 * Compara sem acento e sem caixa. Isto nao é refinamento: o conteudo do produto
 * é em portugues e ninguem digita "Calculo" para achar "Cálculo" — nem o
 * contrario. Sem a dobra, a busca falha nas matérias mais obvias.
 */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * 3 = o campo começa pelo termo, 2 = alguma palavra começa pelo termo,
 * 1 = aparece no meio de uma palavra, 0 = nao aparece.
 */
function scoreField(haystack: string, needle: string): number {
  const index = haystack.indexOf(needle)
  if (index < 0) return 0
  if (index === 0) return 3
  return /[\s\-/(]/.test(haystack[index - 1]) ? 2 : 1
}

/** O melhor score entre os campos, com os posteriores valendo menos. */
function scoreEntry(needle: string, primary: string, ...secondary: string[]): number {
  const best = scoreField(normalize(primary), needle)
  if (best > 0) return best + 1
  for (const field of secondary) {
    if (scoreField(normalize(field), needle) > 0) return 1
  }
  return 0
}

interface SearchInput {
  subjects?: Subject[]
  topics?: Topic[]
  summaries?: Summary[]
  flashcards?: Flashcard[]
  quizzes?: Quiz[]
  mindmaps?: MindMap[]
}

/**
 * Roda a busca sobre tudo que ja esta em cache e devolve os resultados
 * agrupados. Nao existe termo vazio: quem chama decide se ha o que buscar.
 */
export function searchEverything(rawQuery: string, data: SearchInput): SearchGroup[] {
  const needle = normalize(rawQuery.trim())
  if (needle.length < 2) return []

  const subjectsById = new Map((data.subjects ?? []).map((subject) => [subject.id, subject]))
  const results: SearchResult[] = []

  const push = (
    kind: SearchResultKind,
    id: string,
    title: string,
    score: number,
    subjectId?: string
  ) => {
    if (score <= 0) return
    const subject = subjectId ? subjectsById.get(subjectId) : undefined
    results.push({
      key: `${kind}:${id}`,
      kind,
      title,
      context: subject?.name,
      color: subject?.color,
      to: KIND_ROUTES[kind],
      score,
    })
  }

  for (const subject of data.subjects ?? []) {
    push('subject', subject.id, subject.name, scoreEntry(needle, subject.name))
  }

  for (const topic of data.topics ?? []) {
    push('topic', topic.id, topic.name, scoreEntry(needle, topic.name), topic.subjectId)
  }

  for (const summary of data.summaries ?? []) {
    const score = scoreEntry(needle, summary.title, summary.content)
    push('summary', summary.id, summary.title, score, summary.subjectId)
  }

  for (const flashcard of data.flashcards ?? []) {
    const score = scoreEntry(needle, flashcard.front, flashcard.back)
    push('flashcard', flashcard.id, flashcard.front, score, flashcard.subjectId)
  }

  for (const quiz of data.quizzes ?? []) {
    const questions = quiz.questions.map((question) => question.question)
    push('quiz', quiz.id, quiz.title, scoreEntry(needle, quiz.title, ...questions), quiz.subjectId)
  }

  for (const mindmap of data.mindmaps ?? []) {
    const labels = mindmap.nodes.map((node) => node.label)
    const score = scoreEntry(needle, mindmap.title, mindmap.description ?? '', ...labels)
    push('mindmap', mindmap.id, mindmap.title, score, mindmap.subjectId)
  }

  return KIND_ORDER.map((kind) => ({
    kind,
    label: KIND_LABELS[kind],
    results: results
      .filter((result) => result.kind === kind)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'pt-BR'))
      .slice(0, MAX_PER_GROUP),
  })).filter((group) => group.results.length > 0)
}

/** Achata os grupos na ordem visual — é o indice que as setas percorrem. */
export function flattenGroups(groups: SearchGroup[]): SearchResult[] {
  return groups.flatMap((group) => group.results)
}
