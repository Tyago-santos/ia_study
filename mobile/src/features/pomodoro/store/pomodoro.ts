import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  DEFAULT_SETTINGS,
  durationFor,
  nextModeAfter,
  type PomodoroMode,
  type PomodoroSettings,
} from '../libs/timer'

interface PomodoroState {
  settings: PomodoroSettings
  mode: PomodoroMode
  timeLeft: number
  totalTime: number
  isRunning: boolean
  /** Ciclos de foco concluidos, usado para decidir quando a pausa e longa. */
  completedFocus: number
  selectedSubjectId: string | null

  setSettings: (settings: Partial<PomodoroSettings>) => void
  setSelectedSubjectId: (id: string | null) => void
  switchMode: (mode: PomodoroMode) => void
  toggleRunning: () => void
  resetTimer: () => void
  /** Zera o cronometro e avanca para o proximo modo do ciclo. */
  complete: () => void
  tick: () => void
  /** Volta ao estado de app recem instalado — usado no logout, pra nao vazar
   * config/materia selecionada de uma conta pra outra no mesmo aparelho. */
  reset: () => void
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      mode: 'focus',
      timeLeft: durationFor('focus', DEFAULT_SETTINGS),
      totalTime: durationFor('focus', DEFAULT_SETTINGS),
      isRunning: false,
      completedFocus: 0,
      selectedSubjectId: null,

      setSettings: (partial) => {
        const settings = { ...get().settings, ...partial }

        set((state) => {
          // Mudar a duracao no meio de uma sessao em andamento reiniciaria o
          // relogio do usuario, entao so o proximo ciclo pega o valor novo.
          if (state.isRunning) return { settings }

          const total = durationFor(state.mode, settings)
          return { settings, timeLeft: total, totalTime: total }
        })
      },

      setSelectedSubjectId: (id) => set({ selectedSubjectId: id }),

      switchMode: (mode) => {
        const total = durationFor(mode, get().settings)
        set({ mode, isRunning: false, timeLeft: total, totalTime: total })
      },

      toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),

      resetTimer: () =>
        set((state) => {
          const total = durationFor(state.mode, state.settings)
          return { isRunning: false, timeLeft: total, totalTime: total }
        }),

      complete: () =>
        set((state) => {
          const completedFocus =
            state.mode === 'focus' ? state.completedFocus + 1 : state.completedFocus
          const mode = nextModeAfter(state.mode, completedFocus)
          const total = durationFor(mode, state.settings)

          return { mode, completedFocus, isRunning: false, timeLeft: total, totalTime: total }
        }),

      tick: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),

      reset: () =>
        set({
          settings: DEFAULT_SETTINGS,
          mode: 'focus',
          timeLeft: durationFor('focus', DEFAULT_SETTINGS),
          totalTime: durationFor('focus', DEFAULT_SETTINGS),
          isRunning: false,
          completedFocus: 0,
          selectedSubjectId: null,
        }),
    }),
    {
      name: 'studyhub-pomodoro',
      storage: createJSONStorage(() => AsyncStorage),
      // O relogio em si nao e persistido: reabrir o app no meio de um ciclo
      // com o tempo congelado seria pior do que comecar limpo.
      partialize: (state) => ({
        settings: state.settings,
        completedFocus: state.completedFocus,
        selectedSubjectId: state.selectedSubjectId,
      }),
    },
  ),
)
