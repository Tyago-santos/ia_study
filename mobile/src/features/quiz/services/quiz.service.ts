import type { Quiz } from '@/shared/types'

/** Nota a partir da qual o resultado conta como aprovacao. */
export const PASSING_SCORE = 70

export interface QuizResult {
  score: number
  correct: number
  total: number
}

/** Filtra por materia; `null` significa "todas". */
export function filterBySubject(quizzes: Quiz[], subjectId: string | null): Quiz[] {
  if (!subjectId) return quizzes
  return quizzes.filter((quiz) => quiz.subjectId === subjectId)
}

/** Quizzes ja respondidos ao menos uma vez. */
export function completedQuizzes(quizzes: Quiz[]): Quiz[] {
  return quizzes.filter((quiz) => quiz.score !== undefined)
}

/** Media das ultimas notas; sem quiz concluido a media e zero, nao NaN. */
export function averageScore(quizzes: Quiz[]): number {
  const completed = completedQuizzes(quizzes)
  if (completed.length === 0) return 0

  return Math.round(completed.reduce((sum, q) => sum + (q.score ?? 0), 0) / completed.length)
}

export function isPassing(score: number): boolean {
  return score >= PASSING_SCORE
}
