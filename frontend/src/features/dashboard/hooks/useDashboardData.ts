import { useMemo } from 'react'
import type { Activity, DailyStats, Subject, SubjectStats } from '@/shared/types'
import type { CustomRange, DateRange } from '@/features/dashboard/components/DashboardFilters'

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

interface DashboardFiltersState {
  dateRange: DateRange
  customRange: CustomRange
  selectedSubjects: string[]
  selectedTypes: string[]
}

interface UseDashboardDataArgs extends DashboardFiltersState {
  /** Serie diaria terminando hoje, ordenada do dia mais antigo pro mais recente (`/study-sessions/contributions`). */
  contributions: DailyStats[]
  /** Totais por materia, todo o historico (`/study-sessions/subjects`). */
  subjectStats: SubjectStats[]
  subjects: Subject[]
  activities: Activity[]
  weeklyGoalMinutes: number
}

export interface MetricTrend {
  value: number
  isPositive: boolean
  /** Nomeia a comparacao. Sem isso o percentual nao significa nada. */
  label: string
}

function sumMinutes(days: DailyStats[]): number {
  return days.reduce((total, day) => total + day.minutes, 0)
}

function percentChange(current: number, previous: number): number {
  return Math.round(((current - previous) / previous) * 100)
}

/** Hoje contra o dia anterior; ambos existem na serie de contribuicoes. */
function comparePreviousDay(days: DailyStats[]): MetricTrend | undefined {
  if (days.length < 2) return undefined

  const previous = days[days.length - 2].minutes
  if (previous === 0) return undefined

  const value = percentChange(days[days.length - 1].minutes, previous)
  return { value, isPositive: value >= 0, label: 'vs dia anterior' }
}

/**
 * Periodo selecionado contra a janela imediatamente anterior de mesmo tamanho.
 *
 * Devolve `undefined` quando nao ha historico suficiente na serie de
 * contribuicoes. Omitir a tendencia é melhor que inventar a base de comparacao.
 */
function comparePreviousWindow(
  window: DailyStats[],
  allDays: DailyStats[]
): MetricTrend | undefined {
  const size = window.length
  if (size === 0) return undefined

  const startIndex = allDays.findIndex((day) => day.date === window[0].date)
  if (startIndex < size) return undefined

  const previous = sumMinutes(allDays.slice(startIndex - size, startIndex))
  if (previous === 0) return undefined

  const value = percentChange(sumMinutes(window), previous)
  return {
    value,
    isPositive: value >= 0,
    label: size === 1 ? 'vs dia anterior' : `vs ${size} dias anteriores`,
  }
}

function resolveRangeBounds(dateRange: DateRange, customRange: CustomRange, now: Date) {
  const end = now

  if (dateRange === 'today') {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    return { start, end }
  }

  if (dateRange === '30d') {
    const start = new Date(end)
    start.setDate(start.getDate() - 29)
    start.setHours(0, 0, 0, 0)
    return { start, end }
  }

  if (dateRange === 'custom') {
    const start = customRange.start ? new Date(`${customRange.start}T00:00:00`) : new Date(0)
    const customEnd = customRange.end ? new Date(`${customRange.end}T23:59:59`) : end
    return { start, end: customEnd }
  }

  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  start.setHours(0, 0, 0, 0)
  return { start, end }
}

/**
 * Deriva os datasets dos graficos/timeline do dashboard a partir dos dados
 * reais (`/study-sessions/*`, `/activities/recent`, `/subjects`) e dos
 * filtros selecionados.
 */
export function useDashboardData({
  dateRange,
  customRange,
  selectedSubjects,
  selectedTypes,
  contributions,
  subjectStats,
  subjects,
  activities,
  weeklyGoalMinutes,
}: UseDashboardDataArgs) {
  const now = useMemo(() => new Date(), [])

  const rangeBounds = useMemo(
    () => resolveRangeBounds(dateRange, customRange, now),
    [dateRange, customRange, now]
  )

  const chartDays = useMemo(
    () =>
      contributions.filter((d) => {
        const date = new Date(`${d.date}T12:00:00`)
        return date >= rangeBounds.start && date <= rangeBounds.end
      }),
    [contributions, rangeBounds]
  )

  const filteredActivities = useMemo(
    () =>
      activities.filter((a) => {
        const createdAt = new Date(a.createdAt)
        if (createdAt < rangeBounds.start || createdAt > rangeBounds.end) return false
        if (selectedTypes.length > 0 && !selectedTypes.includes(a.type)) return false
        if (selectedSubjects.length > 0 && !selectedSubjects.includes(a.subjectId ?? ''))
          return false
        return true
      }),
    [activities, rangeBounds, selectedTypes, selectedSubjects]
  )

  const weeklyChartData = useMemo(
    () =>
      chartDays.map((d) => {
        const date = new Date(`${d.date}T12:00:00`)
        return {
          name:
            chartDays.length <= 7
              ? DAY_NAMES[date.getDay()]
              : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          minutes: d.minutes,
          pomodoros: d.pomodoros,
        }
      }),
    [chartDays]
  )

  const subjectChartData = useMemo(() => {
    const filtered =
      selectedSubjects.length > 0
        ? subjectStats.filter((s) => selectedSubjects.includes(s.subjectId))
        : subjectStats

    return filtered.map((s) => ({
      name: s.subjectName,
      value: s.totalMinutes,
      color: subjects.find((subj) => subj.id === s.subjectId)?.color ?? '#6b7280',
    }))
  }, [selectedSubjects, subjectStats, subjects])

  const trendData = useMemo(
    () =>
      chartDays.map((d) => ({
        name: new Date(`${d.date}T12:00:00`).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
        value: d.minutes,
      })),
    [chartDays]
  )

  const totalSubjectMinutes = subjectChartData.reduce((acc, s) => acc + s.value, 0)

  /** Minutos por dia do periodo selecionado — fonte real das sparklines. */
  const dailyMinutes = useMemo(() => chartDays.map((d) => d.minutes), [chartDays])

  /** Avanco acumulado sobre a meta semanal, dia a dia, em pontos percentuais. */
  const goalProgressSeries = useMemo(() => {
    if (weeklyGoalMinutes <= 0) return []
    let accumulated = 0
    return contributions.slice(-7).map((day) => {
      accumulated += day.minutes
      return Math.round((accumulated / weeklyGoalMinutes) * 100)
    })
  }, [contributions, weeklyGoalMinutes])

  const todayTrend = useMemo(() => comparePreviousDay(contributions), [contributions])

  const periodTrend = useMemo(
    () => comparePreviousWindow(chartDays, contributions),
    [chartDays, contributions]
  )

  return {
    activities: filteredActivities,
    weeklyChartData,
    subjectChartData,
    trendData,
    totalSubjectMinutes,
    dailyMinutes,
    goalProgressSeries,
    todayTrend,
    periodTrend,
  }
}
