import { api } from '@/shared/services/api'
import type { Activity } from '@/shared/types'

export const activitiesApi = {
  getRecent: (limit?: number) =>
    api.get<Activity[]>(limit ? `/activities/recent?limit=${limit}` : '/activities/recent'),
}
