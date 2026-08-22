import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { DayPlan, PlanBlock } from '@/shared/types'
import { DEFAULT_WEEKLY_GOAL, clampDuration, createEmptyDays } from '../services/planner.service'

interface WeeklyPlannerState {
  days: DayPlan[]
  /** Meta de estudo da semana em minutos, configurada pelo usuario. */
  weeklyGoalMinutes: number
  setWeeklyGoal: (minutes: number) => void
  addBlock: (dayIndex: number, block: PlanBlock) => void
  removeBlock: (dayIndex: number, blockId: string) => void
  updateDuration: (dayIndex: number, blockId: string, duration: number) => void
  /** Define o assunto que sera estudado no bloco; `undefined` volta para geral. */
  updateTopic: (
    dayIndex: number,
    blockId: string,
    topicId: string | undefined,
    topicName: string | undefined,
  ) => void
  /** Define o horario de inicio ("HH:MM"); `undefined` remove o horario. */
  updateStartTime: (dayIndex: number, blockId: string, startTime: string | undefined) => void
  /** Move um bloco entre dias — usado quando o bloco e arrastado para outro dia. */
  moveBlock: (sourceDay: number, destDay: number, blockId: string) => void
  /** Volta ao estado de app recem instalado — usado no logout, pra nao vazar
   * o planejamento de uma conta pra outra no mesmo aparelho. */
  reset: () => void
}

/**
 * O plano da semana e a meta ficam gravados: um planner que zera ao fechar o
 * app nao serve para planejar semana nenhuma. So o estado entra no disco — as
 * acoes sao recriadas a cada abertura.
 *
 * Aqui mora apenas a mutacao do estado; o que e regra (ordenacao, limites de
 * duracao, janela da semana) vive em `services/planner.service`.
 */
export const useWeeklyPlannerStore = create<WeeklyPlannerState>()(
  persist(
    (set) => ({
      days: createEmptyDays(),
      weeklyGoalMinutes: DEFAULT_WEEKLY_GOAL,

      setWeeklyGoal: (minutes) => set({ weeklyGoalMinutes: minutes }),

      addBlock: (dayIndex, block) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.dayIndex === dayIndex ? { ...day, blocks: [...day.blocks, block] } : day,
          ),
        })),

      removeBlock: (dayIndex, blockId) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.dayIndex === dayIndex
              ? { ...day, blocks: day.blocks.filter((b) => b.id !== blockId) }
              : day,
          ),
        })),

      updateDuration: (dayIndex, blockId, duration) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.dayIndex === dayIndex
              ? {
                  ...day,
                  blocks: day.blocks.map((b) =>
                    b.id === blockId ? { ...b, duration: clampDuration(duration) } : b,
                  ),
                }
              : day,
          ),
        })),

      updateTopic: (dayIndex, blockId, topicId, topicName) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.dayIndex === dayIndex
              ? {
                  ...day,
                  blocks: day.blocks.map((b) =>
                    b.id === blockId ? { ...b, topicId, topicName } : b,
                  ),
                }
              : day,
          ),
        })),

      updateStartTime: (dayIndex, blockId, startTime) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.dayIndex === dayIndex
              ? {
                  ...day,
                  blocks: day.blocks.map((b) => (b.id === blockId ? { ...b, startTime } : b)),
                }
              : day,
          ),
        })),

      moveBlock: (sourceDay, destDay, blockId) =>
        set((state) => {
          if (sourceDay === destDay) return state

          const moved = state.days
            .find((d) => d.dayIndex === sourceDay)
            ?.blocks.find((b) => b.id === blockId)
          if (!moved) return state

          return {
            days: state.days.map((day) => {
              if (day.dayIndex === sourceDay) {
                return { ...day, blocks: day.blocks.filter((b) => b.id !== blockId) }
              }
              if (day.dayIndex === destDay) {
                return { ...day, blocks: [...day.blocks, moved] }
              }
              return day
            }),
          }
        }),

      reset: () => set({ days: createEmptyDays(), weeklyGoalMinutes: DEFAULT_WEEKLY_GOAL }),
    }),
    {
      name: 'studyhub-weekly-planner',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ days: state.days, weeklyGoalMinutes: state.weeklyGoalMinutes }),
    },
  ),
)
