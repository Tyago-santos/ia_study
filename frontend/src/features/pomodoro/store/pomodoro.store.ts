import { create } from 'zustand'
import {
  DEFAULT_SETTINGS,
  durationFor,
  type PomodoroMode,
  type PomodoroSettings,
} from '@/features/pomodoro/lib/timer'

const SETTINGS_KEY = 'studyhub-pomodoro-settings'

function loadSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

interface PomodoroState {
  settings: PomodoroSettings
  mode: PomodoroMode
  timeLeft: number
  totalTime: number
  isRunning: boolean
  selectedSubjectId: string
  setSettings: (settings: Partial<PomodoroSettings>) => void
  setSelectedSubjectId: (id: string) => void
  switchMode: (mode: PomodoroMode) => void
  toggleRunning: () => void
  resetTimer: () => void
  completeTransition: (nextMode: PomodoroMode) => void
  tick: () => void
}

const initialSettings = loadSettings()

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  settings: initialSettings,
  mode: 'focus',
  timeLeft: durationFor('focus', initialSettings),
  totalTime: durationFor('focus', initialSettings),
  isRunning: false,
  selectedSubjectId: '',

  setSettings: (partial) => {
    const settings = { ...get().settings, ...partial }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    set((state) => {
      if (state.isRunning) return { settings }
      const total = durationFor(state.mode, settings)
      return { settings, timeLeft: total, totalTime: total }
    })
  },

  setSelectedSubjectId: (id) => set({ selectedSubjectId: id }),

  switchMode: (mode) => {
    if (get().isRunning) return
    const total = durationFor(mode, get().settings)
    set({ mode, timeLeft: total, totalTime: total })
  },

  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),

  resetTimer: () => {
    get().completeTransition(get().mode)
  },

  completeTransition: (nextMode) => {
    const total = durationFor(nextMode, get().settings)
    set({ mode: nextMode, isRunning: false, timeLeft: total, totalTime: total })
  },

  tick: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
}))
