import type { Topic } from '@/shared/types'

export const SUBJECT_COLORS = [
  '#4f46e5',
  '#8b5cf6',
  '#06b6d4',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#ec4899',
  '#14b8a6',
]

export function groupTopicsBySubject(topics: Topic[] | undefined): Map<string, Topic[]> {
  const map = new Map<string, Topic[]>()
  for (const topic of topics ?? []) {
    const list = map.get(topic.subjectId) ?? []
    list.push(topic)
    map.set(topic.subjectId, list)
  }
  return map
}

export function getTopicProgress(topics: Topic[]) {
  const completed = topics.filter((t) => t.completed).length
  return {
    completed,
    total: topics.length,
    percentage: topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0,
  }
}
