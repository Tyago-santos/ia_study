import type { ScheduleEvent } from '@/shared/types'

export interface Reminder {
  /** Identifica o lembrete (nao o compromisso) — um compromisso gera ate 2. */
  id: string
  event: ScheduleEvent
  message: string
  at: Date
}

/**
 * Ate 2 lembretes por compromisso nao concluido: um `leadMinutes` antes e um
 * na hora exata. Mesma ideia do app mobile (`remindersFromEvents`), so que
 * aqui os lembretes so alimentam a lista/toast local — nao existe agendamento
 * no SO, entao so contam enquanto a aba estiver aberta.
 */
export function remindersFromEvents(events: ScheduleEvent[], leadMinutes: number): Reminder[] {
  const reminders: Reminder[] = []

  for (const event of events) {
    if (event.completed) continue
    const at = new Date(event.date)
    if (Number.isNaN(at.getTime())) continue

    if (leadMinutes > 0) {
      reminders.push({
        id: `${event.id}-lead`,
        event,
        message: `Começa em ${leadMinutes} min`,
        at: new Date(at.getTime() - leadMinutes * 60_000),
      })
    }

    reminders.push({
      id: `${event.id}-now`,
      event,
      message: 'Começa agora',
      at,
    })
  }

  return reminders.sort((a, b) => a.at.getTime() - b.at.getTime())
}

export function upcomingReminders(reminders: Reminder[], now = new Date()): Reminder[] {
  return reminders.filter((r) => r.at.getTime() >= now.getTime())
}

/** Lembretes cujo horario caiu dentro de `(from, to]` — a janela de um tick. */
export function dueReminders(reminders: Reminder[], from: Date, to: Date): Reminder[] {
  return reminders.filter((r) => r.at.getTime() > from.getTime() && r.at.getTime() <= to.getTime())
}
