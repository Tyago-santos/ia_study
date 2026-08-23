import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { useUndoableDelete } from '@/shared/hooks/useUndoableDelete'
import { scheduleService } from '@/features/schedule/services/schedule.service'

export function useSchedule(subjectId?: string) {
  return useQuery({
    queryKey: [...queryKeys.schedule.list(), subjectId],
    queryFn: () => scheduleService.getAll({ subjectId }),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: scheduleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })
      toast.success('Evento adicionado ao cronograma!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar evento')
    },
  })
}

export function useToggleEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: scheduleService.toggleComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar evento')
    },
  })
}

/** Exclusao com janela de undo — ver {@link useUndoableDelete}. */
export function useDeleteEvent() {
  return useUndoableDelete({
    rootKey: queryKeys.schedule.all,
    remove: scheduleService.delete,
    message: (label) => `Evento "${label}" removido`,
    errorMessage: 'Erro ao remover evento',
  })
}
