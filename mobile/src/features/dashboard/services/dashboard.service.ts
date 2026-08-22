import type { SubjectStats } from '@/shared/types'

/**
 * Quanto da meta ja foi cumprido de fato — o planner mede o planejado, este
 * numero mede o estudado. Sem meta definida nao ha percentual a mostrar.
 */
export function goalProgressPercent(studiedMinutes: number, goalMinutes: number): number {
  if (!goalMinutes) return 0
  return Math.round((studiedMinutes / goalMinutes) * 100)
}

export function totalSubjectMinutes(stats: SubjectStats[]): number {
  return stats.reduce((sum, stat) => sum + stat.totalMinutes, 0)
}

export function subjectSharePercent(minutes: number, total: number): number {
  if (!total) return 0
  return Math.round((minutes / total) * 100)
}

/**
 * Altura da barra do grafico semanal em pixels. O minimo de 4px garante que um
 * dia sem estudo ainda desenhe um traco, em vez de sumir da linha de base.
 */
export function barHeight(minutes: number, maxMinutes: number): number {
  return Math.max(4, (minutes / Math.max(1, maxMinutes)) * 120)
}
