import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import { plannerService } from '@/shared/services/dataStore'
import type { DayPlan } from '@/shared/types'
import { DAY_LABELS } from '../services/planner.service'

/**
 * A semana do planner no formato que as telas desenham.
 *
 * O servidor guarda a lista achatada com `weekday`; o agrupamento nos sete
 * dias vive aqui porque quatro telas precisam dele (planner, biblioteca,
 * lembretes e dashboard) e cada uma refazendo daria quatro versoes da mesma
 * regra.
 */
export function usePlannerWeek() {
  const { data: blocks, isLoading: loadingBlocks } = useQuery({
    queryKey: queryKeys.planner.blocks(),
    queryFn: plannerService.blocks,
  })
  const { data: weeklyGoalMinutes, isLoading: loadingGoal } = useQuery({
    queryKey: queryKeys.planner.goal(),
    queryFn: plannerService.weeklyGoal,
  })

  /** Os sete dias sempre existem, mesmo vazios: a tela desenha a semana toda. */
  const days = useMemo<DayPlan[]>(
    () =>
      DAY_LABELS.map((dayName, dayIndex) => ({
        dayName,
        dayIndex,
        blocks: (blocks ?? [])
          .filter((block) => block.weekday === dayIndex)
          .map(({ weekday: _weekday, ...block }) => block),
      })),
    [blocks],
  )

  return {
    days,
    weeklyGoalMinutes: weeklyGoalMinutes ?? 0,
    isLoading: loadingBlocks || loadingGoal,
  }
}
