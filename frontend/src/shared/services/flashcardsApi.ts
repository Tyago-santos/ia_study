import { api } from '@/shared/services/api'
import type { Flashcard } from '@/shared/types'

/**
 * Flashcards no backend real. `GET /flashcards` devolve um array plano — SEM
 * paginacao (sem `page`/`limit`/`total` no envelope). Quem precisa de um
 * envelope paginado (ver `flashcards.service.ts`) monta em cima disso.
 */
export const flashcardsApi = {
  list: (subjectId?: string) =>
    api.get<Flashcard[]>(`/flashcards${subjectId ? `?subjectId=${subjectId}` : ''}`),

  stats: () => api.get<{ total: number }>('/flashcards/stats'),

  create: (input: {
    subjectId: string
    front: string
    back: string
    difficulty: Flashcard['difficulty']
  }) => api.post<Flashcard>('/flashcards', input),

  remove: (id: string) => api.delete<void>(`/flashcards/${id}`),
}
