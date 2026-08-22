import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { scheduleService, subjectsService } from '@/shared/services/dataStore'
import { alertUser } from '@/shared/services/notifications'
import { useNotificationSettings } from '@/shared/store/notificationSettings'
import { reminderNotice, scheduleSummary } from '../services/schedule.service'

/**
 * Eventos do cronograma e suas acoes.
 *
 * Criar e concluir avisam o usuario na hora: o efeito real (agendar ou
 * cancelar um lembrete do sistema) e invisivel, e sem o retorno imediato nao
 * ha como saber se funcionou.
 */
export function useSchedule() {
  const queryClient = useQueryClient()
  const { schedule: scheduleReminders, leadMinutes } = useNotificationSettings()

  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: queryKeys.schedule.list(),
    queryFn: scheduleService.list,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })

  const createEvent = useMutation({
    mutationFn: scheduleService.create,
    onSuccess: (event) => {
      invalidate()

      const notice = reminderNotice(event, scheduleReminders, leadMinutes)
      alertUser({ title: `${event.title} criado`, message: notice.message, kind: notice.kind })
    },
  })

  const toggleEvent = useMutation({
    mutationFn: scheduleService.toggle,
    onSuccess: (event) => {
      invalidate()
      alertUser({
        title: event.completed ? `${event.title} concluído` : `${event.title} reaberto`,
        message: event.completed ? 'O lembrete foi cancelado.' : undefined,
        kind: event.completed ? 'success' : 'info',
      })
    },
  })

  const removeEvent = useMutation({ mutationFn: scheduleService.remove, onSuccess: invalidate })

  return {
    isLoading: loadingSubjects || loadingEvents,
    subjects: subjects ?? [],
    events: events ?? [],
    getSubject: (id?: string) => subjects?.find((s) => s.id === id),
    summary: scheduleSummary(events ?? []),
    createEvent,
    toggleEvent,
    removeEvent,
  }
}
