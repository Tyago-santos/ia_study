import { api } from '@/shared/services/api'
import type { Summary } from '@/shared/types'

/** Resumos (cronograma? nao — "resume" no backend) no backend real. */

/** Como vem do servidor: `name` la', `title` aqui; opcionais chegam `null`. */
export interface RemoteSummary {
  id: string
  name: string
  userId: string
  subjectId: string | null
  content: string
  sourceType: string
  createdAt: string
}

export interface CreateSummaryInput {
  name: string
  content: string
  subjectId: string
  sourceType: Summary['sourceType']
}

export function toSummary(remote: RemoteSummary): Summary {
  return {
    id: remote.id,
    subjectId: remote.subjectId ?? '',
    title: remote.name,
    content: remote.content,
    sourceType: (remote.sourceType as Summary['sourceType']) || 'text',
    createdAt: remote.createdAt,
  }
}

export const summariesApi = {
  list: (subjectId?: string) =>
    api.get<RemoteSummary[]>(`/resumes${subjectId ? `?subjectId=${subjectId}` : ''}`),

  create: (input: CreateSummaryInput) => api.post<RemoteSummary>('/resumes', input),
}
