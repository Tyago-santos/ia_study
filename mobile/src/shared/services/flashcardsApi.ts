import { api } from '@/shared/services/api'
import type { Flashcard } from '@/shared/types'

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

  remove: async (id: string) => {
    await api.delete(`/flashcards/${id}`)
    return id
  },
}
