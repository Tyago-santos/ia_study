import { usePomodoroStore } from '@/features/pomodoro/store/pomodoro'
import { clearDatabase } from '@/shared/services/db'
import { clearQueue } from '@/shared/services/offlineFirst'

/**
 * Apaga todo o dado local ligado a uma conta — usado no logout.
 *
 * Sem isto, o proximo usuario a logar no mesmo aparelho herdava a biblioteca,
 * o pomodoro e o planejamento de quem saiu: tudo aqui vive no AsyncStorage,
 * sem escopo por usuario. O que vem do backend volta a ser buscado do zero na
 * proxima consulta.
 *
 * A fila de sincronizacao vai junto: ela guarda escritas feitas offline, e
 * reenvia-las depois do logout as gravaria na conta errada.
 */
export async function resetLocalData(): Promise<void> {
  // O planner nao aparece aqui: os blocos e a meta vivem no banco local
  // (`db.planBlocks`/`db.weeklyGoalMinutes`), entao `clearDatabase` ja leva os dois.
  await clearDatabase()
  await clearQueue()
  usePomodoroStore.getState().reset()
}
