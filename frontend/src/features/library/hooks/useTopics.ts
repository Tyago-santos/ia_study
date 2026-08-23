import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { useUndoableDelete } from '@/shared/hooks/useUndoableDelete'
import { topicsService } from '@/features/library/services/topics.service'

export function useTopics() {
  return useQuery({
    queryKey: queryKeys.topics.list(),
    queryFn: topicsService.getAll,
  })
}

export function useCreateTopic(subjectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => topicsService.create({ subjectId, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar assunto')
    },
  })
}

export function useToggleTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: topicsService.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar assunto')
    },
  })
}

/** Exclusao com janela de undo — ver {@link useUndoableDelete}. */
export function useDeleteTopic() {
  return useUndoableDelete({
    rootKey: queryKeys.topics.all,
    remove: topicsService.delete,
    message: (label) => `Assunto "${label}" removido`,
    errorMessage: 'Erro ao remover assunto',
  })
}
