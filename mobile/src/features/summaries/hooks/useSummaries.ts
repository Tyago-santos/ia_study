import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { subjectsService, summariesService } from '@/shared/services/dataStore'

/** Lista de resumos com as materias resolvidas e as acoes de criar/remover. */
export function useSummaries() {
  const queryClient = useQueryClient()

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: summaries, isLoading: loadingSummaries } = useQuery({
    queryKey: queryKeys.summaries.list(),
    queryFn: summariesService.list,
  })

  // `stats` junto: um resumo novo entra na timeline de atividade do dashboard,
  // que fica montado em outra aba e nao refaz a busca por conta propria.
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.summaries.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
  }

  const createSummary = useMutation({ mutationFn: summariesService.create, onSuccess: invalidate })
  const removeSummary = useMutation({ mutationFn: summariesService.remove, onSuccess: invalidate })

  return {
    isLoading: loadingSubjects || loadingSummaries,
    subjects: subjects ?? [],
    summaries: summaries ?? [],
    getSubject: (id: string) => subjects?.find((s) => s.id === id),
    createSummary,
    removeSummary,
  }
}
