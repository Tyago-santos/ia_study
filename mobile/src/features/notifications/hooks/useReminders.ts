import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { AppState } from 'react-native'
import { queryKeys } from '@/shared/constants/queryKeys'
import { refreshNotificationPermission, rescheduleReminders } from '@/shared/services/notifications'
import { scheduleService } from '@/shared/services/dataStore'
import { useNotificationSettings } from '@/shared/store/notificationSettings'
import { useWeeklyPlannerStore } from '@/features/dashboard/store/weeklyPlanner'
import { remindersFromEvents, remindersFromPlanner } from '../services/reminders.service'

/**
 * Mantem os lembretes do sistema em dia com o cronograma, o planner e as
 * preferencias. Roda no layout do app para valer em qualquer tela.
 */
export function useReminders() {
  const { schedule, planner, leadMinutes } = useNotificationSettings()
  const days = useWeeklyPlannerStore((s) => s.days)

  const { data: events } = useQuery({
    queryKey: queryKeys.schedule.list(),
    queryFn: scheduleService.list,
  })

  const sync = useCallback(() => {
    rescheduleReminders([
      ...(schedule ? remindersFromEvents(events ?? [], leadMinutes) : []),
      ...(planner ? remindersFromPlanner(days, leadMinutes) : []),
    ])
  }, [events, days, schedule, planner, leadMinutes])

  useEffect(() => {
    sync()
  }, [sync])

  /**
   * Voltar do segundo plano e a chance de a permissao ter mudado nas
   * configuracoes do sistema. Sem revalidar, a resposta guardada mantem os
   * lembretes desligados pelo resto da sessao.
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return

      refreshNotificationPermission()
      sync()
    })

    return () => subscription.remove()
  }, [sync])
}
