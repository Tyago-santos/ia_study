import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { statsService } from '@/shared/services/dataStore'
import { resetLocalData } from '@/shared/services/resetLocalData'
import { useAuthStore } from '@/shared/store/auth'
import { initialsOf } from '../services/profile.service'

/** Usuario logado e os numeros que o perfil resume. */
export function useProfile() {
  const user = useAuthStore((s) => s.user)
  const authLogout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()

  // Limpa o dado local antes de soltar o token: sem isto, a proxima conta a
  // logar neste aparelho herdaria a biblioteca/pomodoro/planner de quem saiu
  // (ver resetLocalData). Derrubar o token por ultimo e o que joga o app de
  // volta pro login — o redirect ja existe em app/(app)/_layout.tsx.
  const logout = async () => {
    await resetLocalData()
    queryClient.clear()
    authLogout()
  }

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: queryKeys.stats.dashboard(),
    queryFn: statsService.dashboard,
  })
  const { data: pomodoroStats, isLoading: loadingPomodoroStats } = useQuery({
    queryKey: queryKeys.stats.pomodoro(),
    queryFn: statsService.pomodoro,
  })
  const { data: flashcardStats, isLoading: loadingFlashcardStats } = useQuery({
    queryKey: queryKeys.stats.flashcards(),
    queryFn: statsService.flashcards,
  })

  return {
    isLoading: loadingStats || loadingPomodoroStats || loadingFlashcardStats,
    user,
    logout,
    stats,
    pomodoroStats,
    flashcardStats,
    initials: initialsOf(user?.name),
  }
}
