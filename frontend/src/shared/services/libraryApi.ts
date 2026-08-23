import { api } from '@/shared/services/api'
import type { Subject, Topic } from '@/shared/types'

/**
 * Biblioteca (materias e assuntos) no backend real. Mesma convencao do
 * `scheduleApi.ts`: cliente HTTP tipado por recurso, sem mapeamento porque o
 * shape do backend ja bate com `Subject`/`Topic` do frontend.
 */

export const subjectsApi = {
  list: () => api.get<Subject[]>('/subjects'),

  create: (input: { name: string; color: string; icon?: string }) =>
    api.post<Subject>('/subjects', input),

  remove: (id: string) => api.delete<void>(`/subjects/${id}`),
}

export const topicsApi = {
  list: () => api.get<Topic[]>('/topics'),

  create: (input: { subjectId: string; name: string }) =>
    api.post<Topic>('/topics', input),

  toggle: (id: string) => api.patch<Topic>(`/topics/${id}/toggle`),

  remove: (id: string) => api.delete<void>(`/topics/${id}`),
}
