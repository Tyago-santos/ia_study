import { topicsApi } from '@/shared/services/libraryApi'

export const topicsService = {
  getAll: () => topicsApi.list(),

  create: (data: { subjectId: string; name: string }) => topicsApi.create(data),

  toggle: (id: string) => topicsApi.toggle(id),

  delete: (id: string) => topicsApi.remove(id),
}
