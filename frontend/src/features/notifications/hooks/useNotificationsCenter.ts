import { useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { useSchedule } from '@/features/schedule/hooks/useSchedule'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { dueReminders, remindersFromEvents, upcomingReminders } from '../lib/reminders'

/** Avisa 15 min antes do compromisso, igual ao padrao usado no app. */
const LEAD_MINUTES = 15
const CHECK_INTERVAL_MS = 30_000

/**
 * Lembretes de compromissos, computados a partir do cronograma que a tela ja
 * busca — nao existe uma "central de notificacoes" guardada no servidor (nem
 * aqui, nem no app mobile: la os avisos tambem nascem do cronograma/planner
 * e sao so agendados no aparelho). Aqui eles so valem enquanto a aba estiver
 * aberta: sem isso nao ha como acordar o navegador com a aba fechada.
 */
export function useNotificationsCenter() {
  const { data: events } = useSchedule()
  const { data: settings } = useSettings()
  const notificationsEnabled = settings?.notifications ?? true
  const lastCheckRef = useRef(new Date())
  const firedRef = useRef(new Set<string>())

  const reminders = useMemo(() => remindersFromEvents(events ?? [], LEAD_MINUTES), [events])
  const upcoming = useMemo(() => upcomingReminders(reminders).slice(0, 8), [reminders])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date()
      const due = notificationsEnabled ? dueReminders(reminders, lastCheckRef.current, now) : []

      for (const reminder of due) {
        if (firedRef.current.has(reminder.id)) continue
        firedRef.current.add(reminder.id)

        toast.info(reminder.event.title, { description: reminder.message })

        if (
          typeof Notification !== 'undefined' &&
          Notification.permission === 'granted' &&
          document.hidden
        ) {
          new Notification(reminder.event.title, { body: reminder.message })
        }
      }

      lastCheckRef.current = now
    }, CHECK_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [reminders, notificationsEnabled])

  return { upcoming }
}
