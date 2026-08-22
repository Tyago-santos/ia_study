import { api } from '@/shared/services/api'
import type { ScheduleEvent } from '@/shared/types'

/**
 * Cronograma (compromissos com data) no backend.
 *
 * Arrastar para outro dia e adiar uma semana nao tem rota propria: o app
 * calcula a data nova no fuso do aparelho e manda por `update`. Feito no
 * servidor (UTC), um arrasto as 21h no Brasil cairia no dia seguinte.
 */

/** Como vem do servidor: os opcionais chegam `null`, nao ausentes. */
export interface RemoteScheduleEvent {
  id: string
  title: string
  type: ScheduleEvent['type']
  subjectId: string | null
  date: string
  durationMinutes: number | null
  description: string | null
  completed: boolean
  createdAt: string
}

export interface CreateScheduleEventInput {
  title: string
  type: ScheduleEvent['type']
  date: string
  subjectId?: string
  durationMinutes?: number
  description?: string
}

export interface UpdateScheduleEventInput {
  title?: string
  type?: ScheduleEvent['type']
  date?: string
  durationMinutes?: number | null
  description?: string | null
  completed?: boolean
}

export function toScheduleEvent(remote: RemoteScheduleEvent): ScheduleEvent {
  return {
    id: remote.id,
    title: remote.title,
    type: remote.type,
    date: remote.date,
    completed: remote.completed,
    createdAt: remote.createdAt,
    ...(remote.subjectId ? { subjectId: remote.subjectId } : {}),
    ...(remote.durationMinutes !== null ? { durationMinutes: remote.durationMinutes } : {}),
    ...(remote.description ? { description: remote.description } : {}),
  }
}

export const scheduleApi = {
  list: () => api.get<RemoteScheduleEvent[]>('/schedule'),

  create: (input: CreateScheduleEventInput) =>
    api.post<RemoteScheduleEvent>('/schedule', input),

  update: (id: string, input: UpdateScheduleEventInput) =>
    api.patch<RemoteScheduleEvent>(`/schedule/${id}`, input),

  toggle: (id: string) => api.patch<RemoteScheduleEvent>(`/schedule/${id}/toggle`),

  remove: async (id: string) => {
    await api.delete(`/schedule/${id}`)
    return id
  },
}
