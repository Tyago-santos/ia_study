import { api } from '@/shared/services/api'
import type { Quiz } from '@/shared/types'

export interface SubmitQuizResult {
  score: number
  correct: number
  total: number
}

export interface QuizStats {
  total: number
  completed: number
  average: number
}

export const quizzesApi = {
  list: (subjectId?: string) =>
    api.get<Quiz[]>(`/quizzes${subjectId ? `?subjectId=${subjectId}` : ''}`),

  stats: () => api.get<QuizStats>('/quizzes/stats'),

  create: (input: { subjectId: string; title: string; questions: Quiz['questions'] }) =>
    api.post<Quiz>('/quizzes', input),

  /** Correcao acontece no servidor; devolve o resultado e grava score/completedAt. */
  submit: (input: { quizId: string; answers: Record<string, number> }) =>
    api.post<SubmitQuizResult>(`/quizzes/${input.quizId}/submit`, { answers: input.answers }),

  remove: async (id: string) => {
    await api.delete(`/quizzes/${id}`)
    return id
  },
}
