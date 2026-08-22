import { api } from '@/shared/services/api'
import type { PlanBlock } from '@/shared/types'

/**
 * Planejador semanal no backend.
 *
 * E' uma semana modelo: o bloco guarda `weekday` (0 = domingo), nao uma data —
 * "segunda tem 2h de Biologia" vale toda semana. Arrastar entre dias e' um
 * PATCH trocando `weekday`.
 */

/** Como o bloco vem do servidor: os opcionais chegam `null`, nao ausentes. */
export interface RemotePlanBlock {
  id: string
  weekday: number
  subjectId: string | null
  subjectName: string
  subjectColor: string
  duration: number
  startTime: string | null
  topicId: string | null
  topicName: string | null
  createdAt: string
}

export interface PlannerWeek {
  blocks: RemotePlanBlock[]
  weeklyGoalMinutes: number
}

export interface CreatePlanBlockInput {
  weekday: number
  subjectId?: string
  subjectName: string
  subjectColor: string
  duration: number
  startTime?: string
  topicId?: string
  topicName?: string
}

/** `null` limpa o campo; ausente deixa como esta. */
export interface UpdatePlanBlockInput {
  weekday?: number
  duration?: number
  startTime?: string | null
  topicId?: string | null
  topicName?: string | null
}

/** O app trabalha com `PlanBlock` (opcionais ausentes); o servidor manda `null`. */
export function toPlanBlock(remote: RemotePlanBlock): PlanBlock {
  return {
    id: remote.id,
    subjectId: remote.subjectId ?? '',
    subjectName: remote.subjectName,
    subjectColor: remote.subjectColor,
    duration: remote.duration,
    ...(remote.startTime ? { startTime: remote.startTime } : {}),
    ...(remote.topicId ? { topicId: remote.topicId } : {}),
    ...(remote.topicName ? { topicName: remote.topicName } : {}),
  }
}

export const plannerApi = {
  week: () => api.get<PlannerWeek>('/planner'),

  createBlock: (input: CreatePlanBlockInput) =>
    api.post<RemotePlanBlock>('/planner/blocks', input),

  updateBlock: (id: string, input: UpdatePlanBlockInput) =>
    api.patch<RemotePlanBlock>(`/planner/blocks/${id}`, input),

  removeBlock: async (id: string) => {
    await api.delete(`/planner/blocks/${id}`)
    return id
  },

  setGoal: (weeklyGoalMinutes: number) =>
    api.put<{ weeklyGoalMinutes: number }>('/planner/goal', { weeklyGoalMinutes }),
}
