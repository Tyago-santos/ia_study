import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import {
  plannerService,
  scheduleService,
  subjectsService,
  topicsService,
} from '@/shared/services/dataStore'
import type { Subject } from '@/shared/types'
import {
  DEFAULT_DURATION,
  clampDuration,
  groupEventsByWeekday,
  totalPlannedMinutes,
  unplacedEvents,
} from '../services/planner.service'
import { usePlannerWeek } from './usePlannerWeek'

/**
 * Dados e acoes do planner semanal.
 *
 * Os blocos vivem no backend (com o banco local de espelho, ver
 * `offlineFirst.ts`); o servidor guarda a lista achatada com `weekday` e aqui
 * ela e' agrupada nos sete dias que a tela desenha.
 *
 * As acoes recebem `dayIndex` porque a tela pensa em dias, mas o id do bloco
 * ja' basta para o servidor — o dia so' importa no `moveBlock`.
 */
export function useWeeklyPlanner() {
  const queryClient = useQueryClient()

  const { days, weeklyGoalMinutes } = usePlannerWeek()

  const { data: subjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: topics } = useQuery({
    queryKey: queryKeys.topics.list(),
    queryFn: topicsService.list,
  })
  const { data: events } = useQuery({
    queryKey: queryKeys.schedule.list(),
    queryFn: scheduleService.list,
  })

  const invalidatePlanner = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.planner.all })
  const invalidateSchedule = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })

  const addBlock = useMutation({
    mutationFn: plannerService.addBlock,
    onSuccess: invalidatePlanner,
  })
  const updateBlock = useMutation({
    mutationFn: ({ id, ...patch }: { id: string } & Parameters<typeof plannerService.updateBlock>[1]) =>
      plannerService.updateBlock(id, patch),
    onSuccess: invalidatePlanner,
  })
  const removeBlock = useMutation({
    mutationFn: plannerService.removeBlock,
    onSuccess: invalidatePlanner,
  })
  const setGoal = useMutation({
    mutationFn: plannerService.setWeeklyGoal,
    onSuccess: invalidatePlanner,
  })

  const moveEvent = useMutation({
    mutationFn: scheduleService.moveToWeekday,
    onSuccess: invalidateSchedule,
  })
  const postponeEvent = useMutation({
    mutationFn: scheduleService.postponeWeek,
    onSuccess: invalidateSchedule,
  })

  const eventsByDay = useMemo(() => groupEventsByWeekday(events ?? []), [events])
  const pendingEvents = useMemo(() => unplacedEvents(events ?? []), [events])

  /** O bloco guarda so cor e nome da materia, entao o icone vem daqui. */
  const subjectIcons = useMemo(
    () => new Map((subjects ?? []).map((s) => [s.id, s.icon])),
    [subjects],
  )

  const totalMinutes = totalPlannedMinutes(days)
  const goal = weeklyGoalMinutes ?? 0

  return {
    days,
    weeklyGoalMinutes: goal,
    subjects: subjects ?? [],
    topics: topics ?? [],
    subjectIcons,
    eventsByDay,
    pendingEvents,
    totalMinutes,
    goalProgress: goal > 0 ? (totalMinutes / goal) * 100 : 0,

    /** Solta uma materia num dia, criando o bloco com a duracao padrao. */
    dropSubject: (subject: Subject, dayIndex: number) =>
      addBlock.mutate({
        weekday: dayIndex,
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        duration: DEFAULT_DURATION,
      }),

    /** Arrastar entre dias e' so' trocar o `weekday` do bloco. */
    moveBlock: (sourceDay: number, destDay: number, blockId: string) => {
      if (sourceDay === destDay) return
      updateBlock.mutate({ id: blockId, weekday: destDay })
    },

    updateDuration: (_dayIndex: number, blockId: string, duration: number) =>
      updateBlock.mutate({ id: blockId, duration: clampDuration(duration) }),

    updateStartTime: (_dayIndex: number, blockId: string, startTime: string | undefined) =>
      // `null` limpa o horario no servidor; `undefined` seria "nao mexe".
      updateBlock.mutate({ id: blockId, startTime: startTime ?? null }),

    updateTopic: (
      _dayIndex: number,
      blockId: string,
      topicId: string | undefined,
      topicName: string | undefined,
    ) => updateBlock.mutate({ id: blockId, topicId: topicId ?? null, topicName: topicName ?? null }),

    removeBlock: (_dayIndex: number, blockId: string) => removeBlock.mutate(blockId),

    setWeeklyGoal: (minutes: number) => setGoal.mutate(minutes),

    moveEvent,
    postponeEvent,
  }
}
