export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak'

export interface PomodoroSettings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  soundEnabled: boolean
  showTime: boolean
}

export const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: 'Foco',
  shortBreak: 'Pausa Curta',
  longBreak: 'Pausa Longa',
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  soundEnabled: true,
  showTime: true,
}

export function durationFor(mode: PomodoroMode, settings: PomodoroSettings): number {
  switch (mode) {
    case 'focus':
      return settings.focusMinutes * 60
    case 'shortBreak':
      return settings.shortBreakMinutes * 60
    case 'longBreak':
      return settings.longBreakMinutes * 60
  }
}

export function formatPomodoroTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
