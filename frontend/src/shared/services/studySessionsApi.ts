import { api } from '@/shared/services/api'
import type { DailyStats, SubjectStats } from '@/shared/types'

/**
 * Cliente para `/study-sessions` no backend real.
 *
 * Contrato confirmado lendo `backend/src/modules/studySessions` (controller,
 * router, services, schema) — não há `start`/`pause`/`cancel` de rede: o
 * timer roda 100% no client e só a sessão concluída é enviada ao servidor
 * via `create`.
 */

export type StudySessionType = 'pomodoro' | 'free'

export interface StudySessionRecord {
  id: string
  userId: string
  subjectId: string | null
  subjectName: string | null
  duration: number
  type: StudySessionType
  completedAt: string
  createdAt: string
}

export interface CreateStudySessionInput {
  subjectId?: string
  subjectName?: string
  /** Duração em minutos, calculada localmente pelo timer. */
  duration: number
  type?: StudySessionType
  completedAt?: string
}

export interface DashboardStats {
  todayMinutes: number
  weekMinutes: number
  monthMinutes: number
  streak: number
}

export interface PomodoroStats {
  totalPomodoros: number
}

export const studySessionsApi = {
  create: (data: CreateStudySessionInput) =>
    api.post<StudySessionRecord>('/study-sessions', data),

  getDashboard: () => api.get<DashboardStats>('/study-sessions/dashboard'),

  getWeekly: () => api.get<DailyStats[]>('/study-sessions/weekly'),

  getSubjects: () => api.get<SubjectStats[]>('/study-sessions/subjects'),

  getContributions: () => api.get<DailyStats[]>('/study-sessions/contributions'),

  getPomodoroStats: () => api.get<PomodoroStats>('/study-sessions/pomodoro'),
}
