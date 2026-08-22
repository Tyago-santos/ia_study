import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { statsService, subjectsService } from '@/shared/services/dataStore'
import { studySessionsApi } from '@/shared/services/studySessionsApi'
import { useAuthStore } from '@/shared/store/auth'
import {
  goalProgressPercent,
  totalSubjectMinutes,
} from '../services/dashboard.service'
import { useWeeklyPlannerStore } from '../store/weeklyPlanner'

/** Reune tudo que a tela do dashboard le, para a pagina so montar o layout. */
export function useDashboardData() {
  const user = useAuthStore((s) => s.user)
  const weeklyGoalMinutes = useWeeklyPlannerStore((s) => s.weeklyGoalMinutes)

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: queryKeys.stats.dashboard(),
    queryFn: studySessionsApi.dashboard,
  })
  const { data: weekly, isLoading: loadingWeekly } = useQuery({
    queryKey: [...queryKeys.stats.all, 'weekly'],
    queryFn: studySessionsApi.weekly,
  })
  const { data: subjectStats, isLoading: loadingSubjectStats } = useQuery({
    queryKey: queryKeys.stats.subjects(),
    queryFn: studySessionsApi.subjects,
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
