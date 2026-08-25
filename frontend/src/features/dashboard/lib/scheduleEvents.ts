import type { ScheduleEvent } from '@/shared/types'

/** Domingo 00:00 desta semana ate o domingo seguinte, exclusivo. */
function currentWeekRange(): { start: Date; end: Date } {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay())

  const end = new Date(start)
  end.setDate(end.getDate() + 7)

  return { start, end }
}

/**
 * Compromissos do cronograma agrupados pelo dia da semana. So a semana
 * corrente entra: um evento do mes que vem apareceria na mesma coluna e daria
 * a impressao de estar planejado para agora.
 */
export function groupEventsByWeekday(events: ScheduleEvent[]): Map<number, ScheduleEvent[]> {
  const { start, end } = currentWeekRange()
  const map = new Map<number, ScheduleEvent[]>()

  for (const event of events) {
    const when = new Date(event.date)
    if (when < start || when >= end) continue

    const day = when.getDay()
    map.set(day, [...(map.get(day) ?? []), event])
  }

  return map
}

/**
 * Compromissos pendentes que ainda nao caem nesta semana. Sao os que fazem
 * sentido arrastar para um dia; os que ja estao na semana aparecem no dia.
 */
export function unplacedEvents(events: ScheduleEvent[]): ScheduleEvent[] {
  const { start, end } = currentWeekRange()

  return events.filter((event) => {
    if (event.completed) return false
    const when = new Date(event.date)
    return when < start || when >= end
  })
}
