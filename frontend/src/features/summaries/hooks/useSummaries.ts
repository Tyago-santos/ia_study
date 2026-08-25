import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { generateSummary } from '@/features/ai/services/generation.service'
import type { GenerationInput } from '@/features/ai/lib/generation.prompt'
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

/** Gera o resumo com a IA e ja salva de verdade — sem rascunho pra revisar antes. */
export function useGenerateSummaryWithAI() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: GenerationInput) => {
      const generated = await generateSummary(input)
      return summariesService.create({
        subjectId: input.subject.id,
        title: generated.title,
        content: generated.content,
        sourceType: 'text',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.summaries.all })
      toast.success('Resumo gerado com IA!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao gerar resumo com IA')
    },
  })
}
