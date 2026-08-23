import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { summariesService } from '@/features/summaries/services/summaries.service'

export function useSummaries(subjectId?: string) {
  return useQuery({
    queryKey: [...queryKeys.summaries.list(), subjectId],
    queryFn: () => summariesService.getAll({ subjectId }),
  })
}

export function useCreateSummary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: summariesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.summaries.all })
      toast.success('Resumo criado!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar resumo')
    },
  })
}

export function useGenerateSummaryWithAI() {
  return useMutation({
    mutationFn: summariesService.generateWithAI,
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar resumo com IA')
    },
  })
}

export function useGenerateFlashcardsFromSummary() {
  return useMutation({
    mutationFn: summariesService.generateFlashcards,
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar flashcards')
    },
  })
}
