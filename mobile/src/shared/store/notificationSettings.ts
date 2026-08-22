import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/** Antecedencia oferecida para os lembretes, em minutos. */
export const REMINDER_LEAD_OPTIONS = [0, 5, 10, 15, 30, 60]

interface NotificationSettingsState {
  /** Aviso ao fim de cada ciclo do pomodoro. */
  pomodoro: boolean
  /** Lembrete das provas, trabalhos e revisoes do cronograma. */
  schedule: boolean
  /** Lembrete dos blocos de estudo do planner semanal. */
  planner: boolean
  /** Quantos minutos antes o lembrete dispara. */
  leadMinutes: number

  setPomodoro: (enabled: boolean) => void
  setSchedule: (enabled: boolean) => void
  setPlanner: (enabled: boolean) => void
  setLeadMinutes: (minutes: number) => void
}

export const useNotificationSettings = create<NotificationSettingsState>()(
  persist(
    (set) => ({
      pomodoro: true,
      schedule: true,
      planner: false,
      leadMinutes: 10,

      setPomodoro: (pomodoro) => set({ pomodoro }),
      setSchedule: (schedule) => set({ schedule }),
      setPlanner: (planner) => set({ planner }),
      setLeadMinutes: (leadMinutes) => set({ leadMinutes }),
    }),
    {
      name: 'studyhub-notification-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
