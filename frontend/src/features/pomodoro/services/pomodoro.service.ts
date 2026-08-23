import { studySessionsApi } from '@/shared/services/studySessionsApi'

/**
 * O timer (contagem, pausa, retomada, cancelamento) roda inteiramente no
 * client — ver `pomodoro.store.ts`. A única chamada de rede acontece quando
 * um ciclo de foco termina de verdade: registra a sessão já concluída.
 */
export const pomodoroService = {
  registerFocusSession: (data: { subjectId?: string; duration: number }) =>
    studySessionsApi.create({ ...data, type: 'pomodoro' }),
}
