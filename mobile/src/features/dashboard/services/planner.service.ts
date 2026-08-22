import type { DayPlan, PlanBlock, ScheduleEvent } from '@/shared/types'

export const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const DURATION_STEP = 15
export const MIN_DURATION = 15
export const MAX_DURATION = 240
export const DEFAULT_DURATION = 50

/** Metas oferecidas no seletor, em minutos (2h a 30h por semana). */
export const WEEKLY_GOAL_OPTIONS = [120, 300, 480, 600, 900, 1200, 1500, 1800]
export const DEFAULT_WEEKLY_GOAL = 600

/** Formato compacto usado no planner ("1h30min"). */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h${mins}min`
}

/** Duracao valida de bloco; o passo pode levar o usuario para fora da faixa. */
export function clampDuration(minutes: number): number {
  return Math.max(MIN_DURATION, Math.min(MAX_DURATION, minutes))
}

export function createEmptyDays(): DayPlan[] {
  return DAY_LABELS.map((name, index) => ({ dayName: name, dayIndex: index, blocks: [] }))
}

/**
 * Ordena por horario, mantendo os blocos sem horario no fim. Sem isso a lista
 * do dia ficaria na ordem de insercao e um bloco das 8h poderia aparecer
 * depois de um das 20h.
 */
export function sortBlocks(blocks: PlanBlock[]): PlanBlock[] {
  return [...blocks].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0
    if (!a.startTime) return 1
    if (!b.startTime) return -1
    return a.startTime.localeCompare(b.startTime)
  })
}

/** Fim do bloco derivado do inicio e da duracao, para exibir "14:00 – 14:50". */
export function endTimeOf(block: PlanBlock): string | null {
  if (!block.startTime) return null

  const [hours, minutes] = block.startTime.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null

  const total = hours * 60 + minutes + block.duration
  const endHours = Math.floor(total / 60) % 24
  const endMinutes = total % 60

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

export function totalPlannedMinutes(days: DayPlan[]): number {
  return days.reduce((sum, day) => sum + day.blocks.reduce((s, b) => s + b.duration, 0), 0)
}

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
 * Eventos do cronograma agrupados pelo dia da semana. So a semana corrente
 * entra: um evento do mes que vem apareceria na mesma coluna e daria a
 * impressao de estar planejado para agora.
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

/** Minutos ocupados no dia: blocos planejados mais compromissos ja marcados. */
export function dayTotalMinutes(day: DayPlan, events: ScheduleEvent[]): number {
  const planned = day.blocks.reduce((sum, block) => sum + block.duration, 0)
  const booked = events.reduce((sum, event) => sum + (event.durationMinutes ?? 0), 0)
  return planned + booked
}
