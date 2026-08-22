import type { DailyStats, SubjectStats } from '@/shared/types'

const WEEKS_SHOWN = 20

/** Lado do quadradinho do calendario de estudos, em pixels. */
export const CELL_SIZE = 12

/** Agrupa a serie diaria em colunas de 7 dias, como o calendario do frontend. */
export function toWeeks(days: DailyStats[]): DailyStats[][] {
  const recent = days.slice(-WEEKS_SHOWN * 7)
  const weeks: DailyStats[][] = []

  for (let i = 0; i < recent.length; i += 7) {
    weeks.push(recent.slice(i, i + 7))
  }

  return weeks
}

/** Faixas de intensidade da legenda, do dia vazio ao dia mais cheio. */
export const INTENSITY_STEPS = [0, 0.3, 0.6, 1]

/**
 * Quatro faixas de intensidade, como os quadradinhos do GitHub. Uma escala
 * continua deixaria dias parecidos indistinguiveis a olho nu.
 */
export function dayIntensity(minutes: number, maxMinutes: number): number {
  if (minutes === 0) return 0

  const ratio = minutes / Math.max(1, maxMinutes)
  if (ratio < 0.25) return 0.3
  if (ratio < 0.6) return 0.6
  return 1
}

export function totalSubjectMinutes(stats: SubjectStats[]): number {
  return stats.reduce((sum, stat) => sum + stat.totalMinutes, 0)
}

export function subjectSharePercent(minutes: number, total: number): number {
  if (!total) return 0
  return Math.round((minutes / total) * 100)
}
