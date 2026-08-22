import { api } from '@/shared/services/api'
import type { DailyStats, SubjectStats } from '@/shared/types'

/**
 * Sessoes de estudo no backend — a base do dashboard e da sequencia de dias
 * ali. Fica separado do resto do `dataStore` (local) porque e' o unico pedaco
 * de estatistica que ja fala com o servidor; o resto (biblioteca, flashcards,
 * quiz...) ainda vive so' no aparelho.
 */

export interface DashboardStats {
  todayMinutes: number
  weekMinutes: number
  monthMinutes: number
  streak: number
}

export interface CreateStudySessionInput {
  subjectId?: string
  subjectName?: string
  duration: number
  type: 'pomodoro' | 'free'
}

export const studySessionsApi = {
  dashboard: () => api.get<DashboardStats>('/study-sessions/dashboard'),
  weekly: () => api.get<DailyStats[]>('/study-sessions/weekly'),
  subjects: () => api.get<SubjectStats[]>('/study-sessions/subjects'),
  create: (input: CreateStudySessionInput) => api.post('/study-sessions', input),
}
