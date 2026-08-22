import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { settingsService } from '@/shared/services/dataStore'
import { useNotificationSettings } from '@/shared/store/notificationSettings'
import { useThemeStore } from '@/shared/store/theme'
import type { NotificationToggle } from '../services/settings.service'

/** Preferencias da tela: tema, fonte, notificacoes e ajustes gerais. */
export function useSettings() {
  const queryClient = useQueryClient()
  const { theme, setTheme } = useThemeStore()
  const notifications = useNotificationSettings()

  const { data: settings } = useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: settingsService.get,
  })

  const updateSettings = useMutation({
    mutationFn: settingsService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
  })

  const notificationToggles: NotificationToggle[] = [
    {
      key: 'pomodoro',
      label: 'Pomodoro',
      hint: 'Avisar quando o ciclo terminar',
      value: notifications.pomodoro,
      set: notifications.setPomodoro,
    },
    {
      key: 'schedule',
      label: 'Cronograma',
      hint: 'Lembrar de provas, trabalhos e revisões',
      value: notifications.schedule,
      set: notifications.setSchedule,
    },
    {
      key: 'planner',
      label: 'Planejamento semanal',
      hint: 'Lembrar dos blocos de estudo com horário',
      value: notifications.planner,
      set: notifications.setPlanner,
    },
  ]

  return { theme, setTheme, settings, updateSettings, notifications, notificationToggles }
}
