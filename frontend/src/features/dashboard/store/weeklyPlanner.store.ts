import { useCallback, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import {
  plannerApi,
  toPlanBlock,
  type PlannerWeek,
  type RemotePlanBlock,
} from '@/shared/services/plannerApi'
import type { DayPlan, PlanBlock } from '@/shared/types'
import { MAX_DURATION } from '@/features/dashboard/lib/duration'

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MIN_DURATION = 15
/** Espera antes de gravar no servidor: junta cliques/arrastos seguidos numa unica chamada. */
const SYNC_DEBOUNCE_MS = 500

function groupByWeekday(blocks: RemotePlanBlock[]): DayPlan[] {
  return DAYS.map((name, index) => ({
    dayName: name,
    dayIndex: index,
    blocks: blocks.filter((b) => b.weekday === index).map(toPlanBlock),
  }))
}

/** Reordena/move dentro da mesma estrutura por dia, preservando a posicao das demais. */
function reorderBlocks(
  blocks: RemotePlanBlock[],
  sourceDay: number,
  destDay: number,
  sourceIndex: number,
  destIndex: number
): RemotePlanBlock[] {
  const byDay = new Map<number, RemotePlanBlock[]>()
  for (const block of blocks) {
    const list = byDay.get(block.weekday) ?? []
    list.push(block)
    byDay.set(block.weekday, list)
  }

  const sourceList = byDay.get(sourceDay) ?? []
  const [moved] = sourceList.splice(sourceIndex, 1)
  if (!moved) return blocks
  byDay.set(sourceDay, sourceList)

  const movedBlock = sourceDay === destDay ? moved : { ...moved, weekday: destDay }
  const destList = sourceDay === destDay ? sourceList : (byDay.get(destDay) ?? [])
  destList.splice(destIndex, 0, movedBlock)
  byDay.set(destDay, destList)

  return Array.from(byDay.values()).flat()
}

/**
 * Planejador semanal (backend real). Mantem a mesma forma do store Zustand
 * original — `days`/`addBlock`/`removeBlock`/`updateDuration`/`updateTopic`/`moveBlock`
 * — para os componentes de drag-and-drop nao precisarem mudar.
 *
 * As escritas sao otimistas: a UI responde na hora mexendo direto no cache do
 * React Query, e a chamada de rede acontece depois (com um pequeno debounce
 * para duracao/mover-de-dia, que podem disparar varias vezes seguidas).
 */
export function useWeeklyPlannerStore() {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.planner.blocks()

  const { data } = useQuery({
    queryKey,
    queryFn: () => plannerApi.week(),
  })

  const days = useMemo(() => groupByWeekday(data?.blocks ?? []), [data])

  const syncTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const pendingCreates = useRef(new Map<string, Promise<string>>())

  const updateCache = useCallback(
    (updater: (week: PlannerWeek) => PlannerWeek) => {
      queryClient.setQueryData<PlannerWeek>(queryKey, (current) =>
        current ? updater(current) : current
      )
    },
    [queryClient, queryKey]
  )

  /** Espera a criacao terminar quando o id ainda e' provisorio (bloco recem-arrastado). */
  const resolveId = useCallback(async (id: string) => {
    const pending = pendingCreates.current.get(id)
    return pending ? await pending : id
  }, [])

  const scheduleSync = useCallback((timerKey: string, effect: () => Promise<unknown>) => {
    const timers = syncTimers.current
    const existing = timers.get(timerKey)
    if (existing) clearTimeout(existing)

    timers.set(
      timerKey,
      setTimeout(() => {
        timers.delete(timerKey)
        effect().catch(() => {
          toast.error('Erro ao salvar o planejador')
          queryClient.invalidateQueries({ queryKey: queryKeys.planner.all })
        })
      }, SYNC_DEBOUNCE_MS)
    )
  }, [queryClient])

  const addBlock = useCallback(
    (dayIndex: number, block: PlanBlock) => {
      const tempId = block.id

      updateCache((week) => ({
        ...week,
        blocks: [
          ...week.blocks,
          {
            id: tempId,
            weekday: dayIndex,
            subjectId: block.subjectId || null,
            subjectName: block.subjectName,
            subjectColor: block.subjectColor,
            duration: block.duration,
            startTime: null,
            topicId: block.topicId ?? null,
            topicName: block.topicName ?? null,
            createdAt: new Date().toISOString(),
          },
        ],
      }))

      const creation = plannerApi
        .createBlock({
          weekday: dayIndex,
          ...(block.subjectId ? { subjectId: block.subjectId } : {}),
          subjectName: block.subjectName,
          subjectColor: block.subjectColor,
          duration: block.duration,
          ...(block.topicId ? { topicId: block.topicId } : {}),
          ...(block.topicName ? { topicName: block.topicName } : {}),
        })
        .then((created) => {
          updateCache((week) => ({
            ...week,
            blocks: week.blocks.map((b) => (b.id === tempId ? created : b)),
          }))
          return created.id
        })
        .catch((error) => {
          updateCache((week) => ({
            ...week,
            blocks: week.blocks.filter((b) => b.id !== tempId),
          }))
          toast.error('Erro ao adicionar bloco')
          throw error
        })
        .finally(() => {
          pendingCreates.current.delete(tempId)
        })

      pendingCreates.current.set(tempId, creation)
    },
    [updateCache]
  )

  const removeBlock = useCallback(
    (_dayIndex: number, blockId: string) => {
      updateCache((week) => ({
        ...week,
        blocks: week.blocks.filter((b) => b.id !== blockId),
      }))

      const timers = syncTimers.current
      const pendingTimer = timers.get(blockId)
      if (pendingTimer) {
        clearTimeout(pendingTimer)
        timers.delete(blockId)
      }

      resolveId(blockId)
        .then((realId) => plannerApi.removeBlock(realId))
        .catch(() => {
          toast.error('Erro ao remover bloco')
          queryClient.invalidateQueries({ queryKey: queryKeys.planner.all })
        })
    },
    [updateCache, resolveId, queryClient]
  )

  const updateDuration = useCallback(
    (dayIndex: number, blockId: string, duration: number) => {
      const clamped = Math.max(MIN_DURATION, Math.min(MAX_DURATION, duration))

      updateCache((week) => ({
        ...week,
        blocks: week.blocks.map((b) =>
          b.id === blockId && b.weekday === dayIndex ? { ...b, duration: clamped } : b
        ),
      }))

      scheduleSync(`duration:${blockId}`, async () => {
        const realId = await resolveId(blockId)
        await plannerApi.updateBlock(realId, { duration: clamped })
      })
    },
    [updateCache, scheduleSync, resolveId]
  )

  const updateTopic = useCallback(
    (dayIndex: number, blockId: string, topicId: string | undefined, topicName: string | undefined) => {
      updateCache((week) => ({
        ...week,
        blocks: week.blocks.map((b) =>
          b.id === blockId && b.weekday === dayIndex
            ? { ...b, topicId: topicId ?? null, topicName: topicName ?? null }
            : b
        ),
      }))

      scheduleSync(`topic:${blockId}`, async () => {
        const realId = await resolveId(blockId)
        await plannerApi.updateBlock(realId, {
          topicId: topicId ?? null,
          topicName: topicName ?? null,
        })
      })
    },
    [updateCache, scheduleSync, resolveId]
  )

  const moveBlock = useCallback(
    (sourceDay: number, destDay: number, sourceIndex: number, destIndex: number) => {
      const current = queryClient.getQueryData<PlannerWeek>(queryKey)
      const moved = current?.blocks.filter((b) => b.weekday === sourceDay)[sourceIndex]
      if (!moved) return

      updateCache((week) => ({
        ...week,
        blocks: reorderBlocks(week.blocks, sourceDay, destDay, sourceIndex, destIndex),
      }))

      if (sourceDay !== destDay) {
        scheduleSync(`weekday:${moved.id}`, async () => {
          const realId = await resolveId(moved.id)
          await plannerApi.updateBlock(realId, { weekday: destDay })
        })
      }
    },
    [queryClient, queryKey, updateCache, scheduleSync, resolveId]
  )

  return { days, addBlock, removeBlock, updateDuration, updateTopic, moveBlock }
}

/** Meta semanal de estudo (minutos). Separado do hook acima porque nem todo
 * consumidor precisa dos blocos — so' da meta e de como muda-la. */
export function useWeeklyGoal() {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.planner.blocks()

  const { data } = useQuery({
    queryKey,
    queryFn: () => plannerApi.week(),
  })

  const setGoal = useCallback(
    async (weeklyGoalMinutes: number) => {
      queryClient.setQueryData<PlannerWeek>(queryKey, (current) =>
        current ? { ...current, weeklyGoalMinutes } : current
      )
      try {
        await plannerApi.setGoal(weeklyGoalMinutes)
      } catch (error) {
        toast.error('Erro ao salvar a meta semanal')
        queryClient.invalidateQueries({ queryKey: queryKeys.planner.all })
        throw error
      }
    },
    [queryClient, queryKey]
  )

  return { weeklyGoalMinutes: data?.weeklyGoalMinutes ?? 0, setGoal }
}
