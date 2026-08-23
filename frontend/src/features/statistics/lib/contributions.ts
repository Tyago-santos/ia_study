import type { DailyStats } from '@/shared/types'

export const WEEKDAY_LABELS = ['', 'Seg', '', 'Qua', '', 'Sex', '']
export const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]
export const WEEKS = 53

export const LEVEL_CLASSES = [
  'bg-[var(--bg-secondary)]',
  'bg-primary-200 dark:bg-primary-900',
  'bg-primary-400 dark:bg-primary-700',
  'bg-primary-600 dark:bg-primary-500',
  'bg-primary-800 dark:bg-primary-400',
]

export interface CalendarDay {
  date: string
  minutes: number
  inRange: boolean
}

export interface ContributionGrid {
  weeks: CalendarDay[][]
  monthMarkers: { weekIndex: number; label: string }[]
  totalMinutes: number
  activeDays: number
}

export function getLevel(minutes: number): number {
  if (minutes <= 0) return 0
  if (minutes <= 30) return 1
  if (minutes <= 60) return 2
  if (minutes <= 100) return 3
  return 4
}

/**
 * Lays the daily stats out on a GitHub-style 53-week grid ending on the
 * most recent day present in `days`.
 */
export function buildContributionGrid(days: DailyStats[]): ContributionGrid {
  if (days.length === 0) {
    return { weeks: [], monthMarkers: [], totalMinutes: 0, activeDays: 0 }
  }

  const byDate = new Map(days.map((d) => [d.date, d]))
  const lastDate = days.reduce((latest, d) => (d.date > latest ? d.date : latest), days[0].date)
  const last = new Date(`${lastDate}T00:00:00Z`)

  const endOfWeek = new Date(last)
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + (6 - endOfWeek.getUTCDay()))
  const cursor = new Date(endOfWeek)
  cursor.setUTCDate(cursor.getUTCDate() - (7 * WEEKS - 1))

  const weeks: CalendarDay[][] = []
  const monthMarkers: { weekIndex: number; label: string }[] = []
  let totalMinutes = 0
  let activeDays = 0
  let lastMonth = -1

  for (let w = 0; w < WEEKS; w++) {
    const week: CalendarDay[] = []
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const inRange = cursor.getTime() <= last.getTime()
      const minutes = byDate.get(dateStr)?.minutes ?? 0

      if (inRange) {
        totalMinutes += minutes
        if (minutes > 0) activeDays += 1
      }
      if (cursor.getUTCDate() === 1 && cursor.getUTCMonth() !== lastMonth) {
        monthMarkers.push({ weekIndex: w, label: MONTH_LABELS[cursor.getUTCMonth()] })
        lastMonth = cursor.getUTCMonth()
      }

      week.push({ date: dateStr, minutes, inRange })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    weeks.push(week)
  }

  return { weeks, monthMarkers, totalMinutes, activeDays }
}
