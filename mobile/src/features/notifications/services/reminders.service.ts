import type { Reminder } from '@/shared/services/notifications'
import type { DayPlan, ScheduleEvent } from '@/shared/types'

/** Proxima ocorrencia de um dia da semana com um horario "HH:MM". */
export function nextOccurrence(weekday: number, startTime: string): Date | null {
  const [hours, minutes] = startTime.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null

  const target = new Date()
  target.setHours(hours, minutes, 0, 0)
  target.setDate(target.getDate() - target.getDay() + weekday)

  // Ja passou nesta semana: vale para a proxima.
  if (target.getTime() <= Date.now()) target.setDate(target.getDate() + 7)

  return target
}

/**
 * Ate dois lembretes por compromisso pendente: um com a antecedencia escolhida
 * e outro na hora marcada.
 *
 * O aviso na hora e o que o usuario espera de um cronograma — antes so existia
 * o adiantado, entao com 10 min de antecedencia o horario do compromisso em si
 * passava em silencio.
 *
 * O adiantado so entra se ainda estiver no futuro: para um evento criado a tres
 * minutos do inicio, avisar "comeca em 10 min" seria mentira, e o aviso da hora
 * marcada ja cobre o caso.
 */
export function remindersFromEvents(events: ScheduleEvent[], leadMinutes: number): Reminder[] {
  const reminders: Reminder[] = []
  const now = Date.now()

  for (const event of events) {
    if (event.completed) continue

    const eventAt = new Date(event.date)
    const leadAt = new Date(eventAt.getTime() - leadMinutes * 60_000)

    if (leadMinutes > 0 && leadAt.getTime() > now) {
      reminders.push({
        title: event.title,
        body: `Começa em ${leadMinutes} min`,
        when: leadAt,
        eventAt,
      })
    }

    reminders.push({
      title: event.title,
      body: 'Começa agora',
      when: eventAt,
      eventAt,
    })
  }

  return reminders
}

/**
 * Lembretes dos blocos com horario marcado, na proxima ocorrencia do dia.
 * Mesma regra dos eventos: o adiantado e opcional, o da hora marcada e certo.
 */
export function remindersFromPlanner(days: DayPlan[], leadMinutes: number): Reminder[] {
  const reminders: Reminder[] = []
  const now = Date.now()

  for (const day of days) {
    for (const block of day.blocks) {
      if (!block.startTime) continue

      const occurrence = nextOccurrence(day.dayIndex, block.startTime)
      if (!occurrence) continue

      const title = `Estudar ${block.subjectName}`
      const detail = block.topicName ?? 'Bloco de estudo planejado'
      const leadAt = new Date(occurrence.getTime() - leadMinutes * 60_000)

      if (leadMinutes > 0 && leadAt.getTime() > now) {
        reminders.push({
          title,
          body: `${detail} — começa em ${leadMinutes} min`,
          when: leadAt,
          eventAt: occurrence,
        })
      }

      reminders.push({ title, body: detail, when: occurrence, eventAt: occurrence })
    }
  }

  return reminders
}
