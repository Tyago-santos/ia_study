import { api } from '@/shared/services/api'
import { studySessionsApi } from '@/shared/services/studySessionsApi'
import type { DailyStats, SubjectStats } from '@/shared/types'

/**
 * Estatísticas reais, lidas direto de `/study-sessions/*`, `/flashcards/stats`
 * e `/quizzes/stats` no backend. Onde o backend devolve menos do que o mock
 * antigo tinha, o campo é simplesmente omitido — nada aqui é inventado.
 *
 * `weeklyGoalProgress`/`weeklyGoal` dependem de `weeklyGoalMinutes`, que só
 * existe em `GET /planner`. Como o cliente completo de planner (`plannerApi`)
 * é de outra parte do trabalho, aqui é feita só uma leitura mínima desse
 * campo — nada do resto da lógica de planner é duplicada.
 */

export interface DashboardStatsView {
  todayMinutes: number
  weekMinutes: number
  monthMinutes: number
  streak: number
  /** Meta semanal em minutos (`GET /planner`). 0 se não houver meta definida. */
  weeklyGoal: number
  /** Percentual da meta semanal já cumprido. 0 se não houver meta definida. */
  weeklyGoalProgress: number
}

export interface QuizStatsView {
  /** Média de acerto (%) dos quizzes já respondidos. */
  average: number
  /** Quizzes já respondidos (têm nota). */
  completed: number
  /** Total de quizzes criados (respondidos ou não). */
  total: number
}

export interface FlashcardStatsView {
  total: number
}

async function fetchWeeklyGoalMinutes(): Promise<number> {
  try {
    const planner = await api.get<{ weeklyGoalMinutes: number }>('/planner')
    return planner.weeklyGoalMinutes ?? 0
  } catch {
    // Meta semanal é só um extra do dashboard — se o planner falhar, o resto
    // das estatísticas ainda deve carregar normalmente.
    return 0
  }
}

export const statsService = {
  getDashboard: async (): Promise<DashboardStatsView> => {
    const [stats, weeklyGoal] = await Promise.all([
      studySessionsApi.getDashboard(),
      fetchWeeklyGoalMinutes(),
    ])

    const weeklyGoalProgress = weeklyGoal > 0 ? Math.round((stats.weekMinutes / weeklyGoal) * 100) : 0

    return { ...stats, weeklyGoal, weeklyGoalProgress }
  },

  getSubjectStats: (): Promise<SubjectStats[]> => studySessionsApi.getSubjects(),

  getContributions: (): Promise<DailyStats[]> => studySessionsApi.getContributions(),

  getPomodoroStats: () => studySessionsApi.getPomodoroStats(),

  getQuizStats: (): Promise<QuizStatsView> =>
    api.get<{ total: number; completed: number; average: number }>('/quizzes/stats'),

  getFlashcardStats: (): Promise<FlashcardStatsView> =>
    api.get<{ total: number }>('/flashcards/stats'),
}
