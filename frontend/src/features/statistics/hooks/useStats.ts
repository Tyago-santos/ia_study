import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { statsService } from '@/features/statistics/services/stats.service'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.stats.dashboard(),
    queryFn: statsService.getDashboard,
  })
}

export function useSubjectStats() {
  return useQuery({
    queryKey: queryKeys.stats.subjects(),
    queryFn: statsService.getSubjectStats,
  })
}

export function useContributions() {
  return useQuery({
    queryKey: queryKeys.stats.contributions(),
    queryFn: statsService.getContributions,
  })
}

export function usePomodoroStats() {
  return useQuery({
    queryKey: queryKeys.stats.pomodoro(),
    queryFn: statsService.getPomodoroStats,
  })
}

export function useQuizStats() {
  return useQuery({
    queryKey: queryKeys.stats.quiz(),
    queryFn: statsService.getQuizStats,
  })
}

export function useFlashcardStats() {
  return useQuery({
    queryKey: queryKeys.stats.flashcards(),
    queryFn: statsService.getFlashcardStats,
  })
}
