import { Clock, Flame, Target, TrendingUp } from 'lucide-react'
import { ErrorState, StatsSkeleton } from '@/shared/components/ui'
import { formatMinutes } from '@/shared/lib/utils'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import {
  useContributions,
  useDashboardStats,
  useRecentActivities,
  useSubjectStats,
} from '@/features/statistics/hooks/useStats'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { StatsCard } from '../components/StatsCard'
import { StreakWidget } from '../components/StreakWidget'
import { SubjectDonutChart } from '../components/SubjectDonutChart'
import { TrendAreaChart } from '../components/TrendAreaChart'
import { WeeklyBarChart } from '../components/WeeklyBarChart'
import { WeeklyPlanner } from '../components/weekly-planner/WeeklyPlanner'

export function DashboardPage() {
  const { data: stats, isLoading, error, refetch } = useDashboardStats()
  const { data: contributions } = useContributions()
  const { data: subjectStats } = useSubjectStats()
  const { data: subjects } = useSubjects()
  const { data: activities } = useRecentActivities()

  const dateRange = '7d' as const
  const customRange = { start: '', end: '' }
  const selectedSubjects: string[] = []
  const selectedTypes: string[] = []

  const {
    activities: filteredActivities,
    weeklyChartData,
    subjectChartData,
    trendData,
    totalSubjectMinutes,
    dailyMinutes,
    goalProgressSeries,
    todayTrend,
    periodTrend,
  } = useDashboardData({
    dateRange,
    customRange,
    selectedSubjects,
    selectedTypes,
    contributions: contributions ?? [],
    subjectStats: subjectStats ?? [],
    subjects: subjects ?? [],
    activities: activities ?? [],
    weeklyGoalMinutes: stats?.weeklyGoal ?? 0,
  })

  if (error) {
    return <ErrorState message="Erro ao carregar dashboard" onRetry={refetch} />
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <div className="h-8 w-48 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-64 rounded-lg bg-[var(--bg-secondary)] animate-pulse mt-2" />
        </div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-80 rounded-2xl bg-[var(--bg-secondary)] animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Acompanhe seu progresso de estudos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/*
          Tendencia e sparkline saem de series reais ou nao aparecem. A ofensiva
          nao tem historico proprio nos dados, e a semana nao ganha sparkline
          porque o grafico de barras logo abaixo ja é essa mesma serie inteira.
        */}
        <StatsCard
          label="Horas hoje"
          value={formatMinutes(stats?.todayMinutes ?? 0)}
          icon={Clock}
          gradient="from-primary-500 to-cyan-500"
          trend={todayTrend}
          sparkline={dailyMinutes}
        />
        <StatsCard
          label="Esta semana"
          value={formatMinutes(stats?.weekMinutes ?? 0)}
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-500"
          trend={periodTrend}
        />
        <StatsCard
          label="Ofensiva"
          value={`${stats?.streak ?? 0} dias`}
          icon={Flame}
          gradient="from-amber-500 to-orange-500"
        />
        <StatsCard
          label="Meta semanal"
          value={`${stats?.weeklyGoalProgress ?? 0}%`}
          icon={Target}
          gradient="from-primary-500 to-primary-700"
          sparkline={goalProgressSeries}
        />
      </div>

      <WeeklyPlanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyBarChart data={weeklyChartData} />
        </div>
        <StreakWidget streak={stats?.streak ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectDonutChart
          data={subjectChartData}
          title="Distribuicao por materia"
          centerValue={formatMinutes(totalSubjectMinutes)}
          centerLabel="total"
        />
        <TrendAreaChart
          data={trendData}
          title="Tendencia semanal"
          color="#15803d"
          valueLabel="minutos"
          gradientId="colorTrend"
        />
      </div>

      <ActivityTimeline activities={filteredActivities} />
    </div>
  )
}
