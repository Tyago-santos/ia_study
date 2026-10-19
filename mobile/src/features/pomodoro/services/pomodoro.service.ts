import { Tints } from '@/shared/constants/theme'
import type { PomodoroMode } from '../libs/timer'

/** Cor por modo: foco em vermelho, pausas em violeta/ciano. */
export const MODE_COLORS: Record<PomodoroMode, string> = {
  focus: Tints.red,
  shortBreak: Tints.violet,
  longBreak: Tints.cyan,
}

/** Quanto do ciclo ja passou, em 0..100. */
export function cycleProgress(timeLeft: number, totalTime: number): number {
  if (totalTime <= 0) return 0
  return ((totalTime - timeLeft) / totalTime) * 100
}

/**
 * Foco sem materia escolhida nao pode comecar: a sessao seria creditada a
 * ninguem e sumiria das estatisticas.
 */
export function isStartBlocked(mode: PomodoroMode, selectedSubjectId: string | null): boolean {
  return mode === 'focus' && !selectedSubjectId
}
