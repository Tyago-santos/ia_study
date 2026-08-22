import { Tints } from '@/shared/constants/theme'
import type { DayPlan, Subject, Topic } from '@/shared/types'

/** Paleta oferecida ao criar uma materia. */
export const SUBJECT_COLORS = [
  Tints.green,
  Tints.amber,
  Tints.emerald,
  Tints.red,
  Tints.cyan,
  Tints.violet,
]

export function groupTopicsBySubject(topics: Topic[]): Map<string, Topic[]> {
  const map = new Map<string, Topic[]>()

  for (const topic of topics) {
    map.set(topic.subjectId, [...(map.get(topic.subjectId) ?? []), topic])
  }

  return map
}

/**
 * Tempo planejado por assunto, somado dos blocos do planner semanal. E tempo
 * planejado, nao estudado: as sessoes de estudo so guardam a materia, entao
 * nao ha como atribuir minutos reais a um assunto especifico.
 */
export function plannedMinutesByTopic(days: DayPlan[]): Map<string, number> {
  const map = new Map<string, number>()

  for (const day of days) {
    for (const block of day.blocks) {
      if (!block.topicId) continue
      map.set(block.topicId, (map.get(block.topicId) ?? 0) + block.duration)
    }
  }

  return map
}

export function searchSubjects(subjects: Subject[], term: string): Subject[] {
  const needle = term.toLowerCase()
  return subjects.filter((subject) => subject.name.toLowerCase().includes(needle))
}

export function completionPercent(topics: Topic[]): number {
  if (topics.length === 0) return 0
  return (topics.filter((t) => t.completed).length / topics.length) * 100
}
