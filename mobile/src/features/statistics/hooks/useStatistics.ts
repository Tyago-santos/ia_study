import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import { statsService, subjectsService } from '@/shared/services/dataStore'
import { flashcardsApi } from '@/shared/services/flashcardsApi'
import { valueThrough } from '@/shared/services/offlineFirst'
import { quizzesApi } from '@/shared/services/quizzesApi'
import { studySessionsApi } from '@/shared/services/studySessionsApi'
import { toWeeks, totalSubjectMinutes } from '../services/statistics.service'

/**
 * Todas as series que a tela de estatisticas desenha.
 *
 * Tudo vem do backend: tempo/materia, calendario e pomodoros das sessoes de
 * estudo, mais as agregacoes de quiz e flashcard dos modulos deles. O banco
 * local so entra como espelho quando o servidor nao responde (`valueThrough`).
 */
export function useStatistics() {
  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: queryKeys.stats.dashboard(),
    queryFn: () => valueThrough(studySessionsApi.dashboard, statsService.dashboard),
  })
  const { data: subjectStats, isLoading: loadingSubjectStats } = useQuery({
    queryKey: queryKeys.stats.subjects(),
    queryFn: () => valueThrough(studySessionsApi.subjects, statsService.subjects),
  })
  const { data: contributions, isLoading: loadingContributions } = useQuery({
    queryKey: queryKeys.stats.contributions(),
    queryFn: () => valueThrough(studySessionsApi.contributions, statsService.contributions),
  })
  const { data: quizStats, isLoading: loadingQuizStats } = useQuery({
    queryKey: queryKeys.stats.quiz(),
    queryFn: () => valueThrough(quizzesApi.stats, statsService.quiz),
  })
  const { data: flashcardStats, isLoading: loadingFlashcardStats } = useQuery({
    queryKey: queryKeys.stats.flashcards(),
    queryFn: () => valueThrough(flashcardsApi.stats, statsService.flashcards),
  })
  const { data: pomodoroStats, isLoading: loadingPomodoroStats } = useQuery({
    queryKey: queryKeys.stats.pomodoro(),
    queryFn: studySessionsApi.pomodoro,
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
