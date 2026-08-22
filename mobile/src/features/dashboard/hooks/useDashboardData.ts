import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { statsService, subjectsService } from '@/shared/services/dataStore'
import { valueThrough } from '@/shared/services/offlineFirst'
import { studySessionsApi } from '@/shared/services/studySessionsApi'
import { useAuthStore } from '@/shared/store/auth'
import {
  goalProgressPercent,
  totalSubjectMinutes,
} from '../services/dashboard.service'
import { usePlannerWeek } from './usePlannerWeek'

/** Reune tudo que a tela do dashboard le, para a pagina so montar o layout. */
export function useDashboardData() {
  const user = useAuthStore((s) => s.user)
  const { weeklyGoalMinutes } = usePlannerWeek()

  // Servidor primeiro; sem ele, o dashboard ainda abre com o que o aparelho
  // tem gravado das sessoes locais, em vez de ficar vazio.
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: queryKeys.stats.dashboard(),
    queryFn: () => valueThrough(studySessionsApi.dashboard, statsService.dashboard),
  })
  const { data: weekly, isLoading: loadingWeekly } = useQuery({
    queryKey: [...queryKeys.stats.all, 'weekly'],
    queryFn: () => valueThrough(studySessionsApi.weekly, statsService.weekly),
  })
  const { data: subjectStats, isLoading: loadingSubjectStats } = useQuery({
    queryKey: queryKeys.stats.subjects(),
    queryFn: () => valueThrough(studySessionsApi.subjects, statsService.subjects),
  })
  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: [...queryKeys.stats.all, 'activities'],
    queryFn: statsService.activities,
  })
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })

  return {
    isLoading:
      loadingStats || loadingWeekly || loadingSubjectStats || loadingActivities || loadingSubjects,
    user,
    stats,
    weekly: weekly ?? [],
    subjectStats: subjectStats ?? [],
    activities: activities ?? [],
    subjects: subjects ?? [],
    maxDayMinutes: Math.max(1, ...(weekly ?? []).map((day) => day.minutes)),
    goalProgress: goalProgressPercent(stats?.weekMinutes ?? 0, weeklyGoalMinutes),
    subjectMinutesTotal: totalSubjectMinutes(subjectStats ?? []),
  }
}
