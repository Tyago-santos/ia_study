import { api } from '@/shared/services/api'
import type { Subject, Topic } from '@/shared/types'

/**
 * Biblioteca (materias e assuntos) no backend. Mesmas assinaturas dos antigos
 * `subjectsService`/`topicsService` do dataStore local — os hooks trocam so' o
 * import e o resto continua igual.
 */

export const subjectsApi = {
  list: () => api.get<Subject[]>('/subjects'),

  create: (input: { name: string; color: string; icon?: string }) =>
    api.post<Subject>('/subjects', input),

  /** O backend devolve a materia removida; o contrato antigo devolvia o id. */
  remove: async (id: string) => {
    await api.delete(`/subjects/${id}`)
    return id
  },
}

export const topicsApi = {
  list: () => api.get<Topic[]>('/topics'),

  create: (input: { subjectId: string; name: string }) =>
    api.post<Topic>('/topics', input),

  toggle: (id: string) => api.patch<Topic>(`/topics/${id}/toggle`),

  remove: async (id: string) => {
    await api.delete(`/topics/${id}`)
    return id
  },
}
