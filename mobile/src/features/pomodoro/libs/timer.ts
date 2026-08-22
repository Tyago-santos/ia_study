export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak'

export interface PomodoroSettings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  /** Falar em voz alta quando o ciclo termina. */
  soundEnabled: boolean
  /** Frase dita ao fim do ciclo; editavel nas configuracoes. */
  endPhrase: string
  /** Enviar tambem a notificacao para a bandeja do sistema. */
  systemNotification: boolean
}

export const DEFAULT_END_PHRASE = 'Tempo acabou'

export const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: 'Foco',
  shortBreak: 'Pausa Curta',
  longBreak: 'Pausa Longa',
}

/** Duracoes oferecidas no seletor de configuracao, em minutos. */
export const DURATION_OPTIONS = [5, 10, 15, 20, 25, 30, 45, 50, 60]

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  soundEnabled: true,
  endPhrase: DEFAULT_END_PHRASE,
  systemNotification: true,
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

/**
 * A cada 4 ciclos de foco a pausa e longa, que e a cadencia classica da tecnica.
 */
export function nextModeAfter(mode: PomodoroMode, completedFocus: number): PomodoroMode {
  if (mode !== 'focus') return 'focus'
  return completedFocus > 0 && completedFocus % 4 === 0 ? 'longBreak' : 'shortBreak'
}
