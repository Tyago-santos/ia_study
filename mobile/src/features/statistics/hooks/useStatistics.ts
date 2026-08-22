import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import { statsService, subjectsService } from '@/shared/services/dataStore'
import { toWeeks, totalSubjectMinutes } from '../services/statistics.service'

/** Todas as series que a tela de estatisticas desenha. */
export function useStatistics() {
  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: queryKeys.stats.dashboard(),
    queryFn: statsService.dashboard,
  })
  const { data: subjectStats, isLoading: loadingSubjectStats } = useQuery({
    queryKey: queryKeys.stats.subjects(),
    queryFn: statsService.subjects,
  })
  const { data: contributions, isLoading: loadingContributions } = useQuery({
    queryKey: queryKeys.stats.contributions(),
    queryFn: statsService.contributions,
  })
  const { data: quizStats, isLoading: loadingQuizStats } = useQuery({
    queryKey: queryKeys.stats.quiz(),
    queryFn: statsService.quiz,
  })
  const { data: flashcardStats, isLoading: loadingFlashcardStats } = useQuery({
    queryKey: queryKeys.stats.flashcards(),
    queryFn: statsService.flashcards,
  })
  const { data: pomodoroStats, isLoading: loadingPomodoroStats } = useQuery({
    queryKey: queryKeys.stats.pomodoro(),
    queryFn: statsService.pomodoro,
  })
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })

  const weeks = useMemo(() => toWeeks(contributions ?? []), [contributions])

  return {
    isLoading:
      loadingDashboard ||
      loadingSubjectStats ||
      loadingContributions ||
      loadingQuizStats ||
      loadingFlashcardStats ||
      loadingPomodoroStats ||
      loadingSubjects,
    dashboard,
    subjectStats: subjectStats ?? [],
    quizStats,
    flashcardStats,
    pomodoroStats,
    subjects: subjects ?? [],
    weeks,
    maxDayMinutes: Math.max(1, ...(contributions ?? []).map((d) => d.minutes)),
    subjectMinutesTotal: totalSubjectMinutes(subjectStats ?? []),
  }
}
