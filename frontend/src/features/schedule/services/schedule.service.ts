import { scheduleApi, toScheduleEvent } from '@/shared/services/scheduleApi'
import type { ScheduleEvent } from '@/shared/types'

/** Cronograma (compromissos com data) no backend real. */
export const scheduleService = {
  getAll: async (params?: { subjectId?: string }) => {
    const events = (await scheduleApi.list()).map(toScheduleEvent)
    const filtered = params?.subjectId
      ? events.filter((e) => e.subjectId === params.subjectId)
      : events
    return [...filtered].sort((a, b) => a.date.localeCompare(b.date))
  },

  create: async (data: {
    title: string
    type: ScheduleEvent['type']
    date: string
    subjectId?: string
    description?: string
  }) => {
    const event = await scheduleApi.create(data)
    return toScheduleEvent(event)
  },

  toggleComplete: async (id: string) => {
    const event = await scheduleApi.toggle(id)
    return toScheduleEvent(event)
  },

  updateDate: async (id: string, date: string) => {
    const event = await scheduleApi.update(id, { date })
    return toScheduleEvent(event)
  },

  delete: async (id: string) => {
    await scheduleApi.remove(id)
  },
}
