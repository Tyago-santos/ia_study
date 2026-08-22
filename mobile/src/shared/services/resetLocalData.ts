import { useWeeklyPlannerStore } from '@/features/dashboard/store/weeklyPlanner'
import { usePomodoroStore } from '@/features/pomodoro/store/pomodoro'
import { clearDatabase } from '@/shared/services/db'

/**
 * Apaga todo o dado local ligado a uma conta — usado no logout.
 *
 * Sem isto, o proximo usuario a logar no mesmo aparelho herdava a biblioteca,
 * o pomodoro e o planejamento de quem saiu: tudo aqui vive no AsyncStorage,
 * sem escopo por usuario. O que hoje vem do backend (dashboard, sequencia,
 * matérias, mapas, resumos) volta a ser buscado do zero na proxima consulta.
 */
export async function resetLocalData(): Promise<void> {
  await clearDatabase()
  usePomodoroStore.getState().reset()
  useWeeklyPlannerStore.getState().reset()
}
