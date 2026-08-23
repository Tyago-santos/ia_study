import { api } from '@/shared/services/api'
import type { Quiz } from '@/shared/types'

/**
 * Correcao acontece no servidor. Shape real confirmado em
 * `backend/src/modules/quiz/services/index.ts` (metodo `submit`): `score` ja
 * vem como porcentagem (0-100) — o mock antigo tinha `.percentage` separado,
 * o backend nao devolve esse campo (ver `quiz.service.ts` pra o ajuste).
 */
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

  submit: (input: { quizId: string; answers: Record<string, number> }) =>
    api.post<SubmitQuizResult>(`/quizzes/${input.quizId}/submit`, { answers: input.answers }),

  remove: (id: string) => api.delete<void>(`/quizzes/${id}`),
}
