import { Card, CardContent, CardHeader, CardTitle, ErrorState, StatsSkeleton } from '@/shared/components/ui'
import {
  useContributions,
  useDashboardStats,
  useFlashcardStats,
  usePomodoroStats,
  useQuizStats,
  useSubjectStats,
} from '@/features/statistics/hooks/useStats'
import { ContributionCalendar } from '../components/ContributionCalendar'
import { QuizPerformanceCard } from '../components/QuizPerformanceCard'
import { StatsOverview } from '../components/StatsOverview'
import { SubjectTimeCard } from '../components/SubjectTimeCard'

export function StatisticsPage() {
  const { data: dashboardStats, isLoading, error, refetch } = useDashboardStats()
  const { data: subjectStats, isLoading: subjectLoading } = useSubjectStats()
  const { data: pomodoroStats } = usePomodoroStats()
  const { data: quizStats } = useQuizStats()
  const { data: flashcardStats } = useFlashcardStats()
  const { data: contributions, isLoading: contributionsLoading } = useContributions()

  if (error) {
    return <ErrorState message="Erro ao carregar estatísticas" onRetry={refetch} />
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[var(--bg-secondary)] rounded animate-pulse" />
        <StatsSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Estatísticas</h1>
        <p className="text-[var(--text-secondary)]">Acompanhe sua evolução detalhada</p>
      </div>

      <StatsOverview
        totalMinutes={dashboardStats?.monthMinutes ?? 0}
        totalPomodoros={pomodoroStats?.totalPomodoros ?? 0}
        totalFlashcards={flashcardStats?.total ?? 0}
        quizAverage={quizStats?.average ?? 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectTimeCard stats={subjectStats} isLoading={subjectLoading} />

        <Card>
          <CardHeader>
            <CardTitle>Evolução semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-[var(--text-secondary)]">
              Gráfico de evolução semanal
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário de estudos</CardTitle>
        </CardHeader>
        <CardContent>
          {contributionsLoading ? (
            <div className="h-32 bg-[var(--bg-secondary)] rounded animate-pulse" />
          ) : contributions && contributions.length > 0 ? (
            <ContributionCalendar days={contributions} />
          ) : (
            <p className="text-center text-[var(--text-secondary)] py-8">Nenhum dado disponível</p>
          )}
        </CardContent>
      </Card>

      <QuizPerformanceCard
        average={quizStats?.average ?? 0}
        completed={quizStats?.completed ?? 0}
        total={quizStats?.total ?? 0}
      />
    </div>
  )
}
