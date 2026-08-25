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

/**
 * Move um compromisso para um dia da semana corrente, preservando o horario.
 * Usado ao arrastar um compromisso para um dia no planejador semanal.
 */
export function useMoveEventToWeekday() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, weekday, date }: { id: string; weekday: number; date: string }) => {
      const current = new Date(date)
      const target = new Date()
      target.setHours(current.getHours(), current.getMinutes(), 0, 0)
      target.setDate(target.getDate() - target.getDay() + weekday)
      return scheduleService.updateDate(id, target.toISOString())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao mover compromisso')
    },
  })
}

/** Adia um compromisso em uma semana, mantendo o horario. */
export function usePostponeEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      const next = new Date(date)
      next.setDate(next.getDate() + 7)
      return scheduleService.updateDate(id, next.toISOString())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adiar compromisso')
    },
  })
}
