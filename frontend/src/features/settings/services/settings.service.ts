import { mockSettings } from '@/shared/mocks/data'
import { delay } from '@/shared/mocks/helpers'

export const settingsService = {
  get: () => delay({ ...mockSettings }),

  update: async (data: Record<string, unknown>) => {
    return delay({ ...mockSettings, ...data })
  },
}
