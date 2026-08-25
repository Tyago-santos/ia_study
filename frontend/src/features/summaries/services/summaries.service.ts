import { summariesApi, toSummary } from '@/shared/services/summariesApi'
import type { Summary } from '@/shared/types'

/** Resumos (cronograma de estudo) no backend real. */
export const summariesService = {
  getAll: async (params?: { subjectId?: string }) => {
    const summaries = (await summariesApi.list(params?.subjectId)).map(toSummary)
    return [...summaries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  create: async (data: {
    subjectId: string
    title: string
    content: string
    sourceType: Summary['sourceType']
  }) => {
    const summary = await summariesApi.create({
      name: data.title,
      content: data.content,
      subjectId: data.subjectId,
      sourceType: data.sourceType,
    })
    return toSummary(summary)
  },
}
