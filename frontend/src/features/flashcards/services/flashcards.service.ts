import { flashcardsApi } from '@/shared/services/flashcardsApi'
import type { Flashcard } from '@/shared/types'

/**
 * O backend real (`GET /flashcards`) devolve um array plano, sem paginacao.
 * Os hooks (`useFlashcards`) e a busca global ainda esperam o envelope
 * `{flashcards, total}` que o mock antigo simulava — mantemos esse contrato
 * aqui, so' que montado em cima da lista inteira (sem `page`/`limit` reais).
 */
export const flashcardsService = {
  getAll: async (params?: { subjectId?: string; page?: number; limit?: number }) => {
    const flashcards = await flashcardsApi.list(params?.subjectId)
    return { flashcards, total: flashcards.length }
  },

  create: async (data: {
    subjectId: string
    front: string
    back: string
    difficulty?: Flashcard['difficulty']
  }) => flashcardsApi.create({ ...data, difficulty: data.difficulty ?? 'medium' }),

  delete: (id: string) => flashcardsApi.remove(id),
}
