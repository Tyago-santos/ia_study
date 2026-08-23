import { subjectsApi } from '@/shared/services/libraryApi'

export const subjectsService = {
  getAll: () => subjectsApi.list(),

  create: (data: { name: string; color: string; icon?: string }) => subjectsApi.create(data),

  delete: (id: string) => subjectsApi.remove(id),
}
