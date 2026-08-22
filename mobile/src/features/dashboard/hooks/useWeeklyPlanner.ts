import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import { createId } from '@/shared/lib/id'
import { scheduleService, subjectsService, topicsService } from '@/shared/services/dataStore'
import type { Subject } from '@/shared/types'
import {
  DEFAULT_DURATION,
  groupEventsByWeekday,
  totalPlannedMinutes,
  unplacedEvents,
} from '../services/planner.service'
import { useWeeklyPlannerStore } from '../store/weeklyPlanner'

/**
 * Dados e acoes do planner. Junta o estado persistido com o que vem do
 * dataStore para que o componente cuide so do arrasto e do desenho.
 */
export function useWeeklyPlanner() {
  const planner = useWeeklyPlannerStore()
  const queryClient = useQueryClient()

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

  const invalidateSchedule = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all })

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

  const totalMinutes = totalPlannedMinutes(planner.days)

  return {
    ...planner,
    subjects: subjects ?? [],
    topics: topics ?? [],
    subjectIcons,
    eventsByDay,
    pendingEvents,
    totalMinutes,
    goalProgress:
      planner.weeklyGoalMinutes > 0 ? (totalMinutes / planner.weeklyGoalMinutes) * 100 : 0,
    /** Solta uma materia num dia, criando o bloco com a duracao padrao. */
    dropSubject: (subject: Subject, dayIndex: number) =>
      planner.addBlock(dayIndex, {
        id: createId('blk'),
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        duration: DEFAULT_DURATION,
      }),
    moveEvent,
    postponeEvent,
  }
}
