import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { useUndoableDelete } from '@/shared/hooks/useUndoableDelete'
import type { Flashcard } from '@/shared/types'
import { flashcardsService } from '@/features/flashcards/services/flashcards.service'

export function useFlashcards(subjectId?: string) {
  return useQuery({
    queryKey: subjectId ? queryKeys.flashcards.bySubject(subjectId) : queryKeys.flashcards.list(),
    queryFn: () => flashcardsService.getAll({ subjectId }),
  })
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: flashcardsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.flashcards.all })
      toast.success('Flashcard criado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar flashcard')
    },
  })
}

/**
 * Exclusao com janela de undo — ver {@link useUndoableDelete}. A query guarda
 * uma lista paginada dentro de um objeto, por isso o removedor é explicito.
 */
export function useDeleteFlashcard() {
  return useUndoableDelete<{ flashcards: Flashcard[]; total: number }>({
    rootKey: queryKeys.flashcards.all,
    remove: flashcardsService.delete,
    message: (label) => `Flashcard "${label}" excluído`,
    errorMessage: 'Erro ao excluir flashcard',
    dropFromCache: (data, id) => ({
      flashcards: data.flashcards.filter((card) => card.id !== id),
      total: Math.max(0, data.total - 1),
    }),
  })
}
