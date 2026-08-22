import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { flashcardsService, subjectsService } from '@/shared/services/dataStore'

/** Cartoes e materias da tela, com as acoes de criar e remover. */
export function useFlashcards() {
  const queryClient = useQueryClient()

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: flashcards, isLoading: loadingFlashcards } = useQuery({
    queryKey: queryKeys.flashcards.list(),
    queryFn: () => flashcardsService.list(),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.flashcards.all })

  const createFlashcard = useMutation({
    mutationFn: flashcardsService.create,
    onSuccess: invalidate,
  })
  const removeFlashcard = useMutation({
    mutationFn: flashcardsService.remove,
    onSuccess: invalidate,
  })

  return {
    isLoading: loadingSubjects || loadingFlashcards,
    subjects: subjects ?? [],
    flashcards: flashcards ?? [],
    getSubject: (id: string) => subjects?.find((s) => s.id === id),
    createFlashcard,
    removeFlashcard,
  }
}
