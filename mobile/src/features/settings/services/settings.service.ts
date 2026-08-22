import type { Ionicons } from '@expo/vector-icons'
import type { Theme } from '@/shared/types'

export const THEME_OPTIONS: {
  value: Theme
  label: string
  icon: keyof typeof Ionicons.glyphMap
}[] = [
  { value: 'light', label: 'Claro', icon: 'sunny' },
  { value: 'dark', label: 'Escuro', icon: 'moon' },
  { value: 'reading', label: 'Leitura', icon: 'book' },
]

export const FONT_SIZES = [
  { value: 'small', label: 'Pequena' },
  { value: 'medium', label: 'Média' },
  { value: 'large', label: 'Grande' },
] as const

export type FontSize = (typeof FONT_SIZES)[number]['value']

export interface NotificationToggle {
  key: string
  label: string
  hint: string
  value: boolean
  set: (value: boolean) => void
}

/** Rotulo da antecedencia do lembrete; zero vira "Na hora". */
export function leadLabel(minutes: number): string {
  return minutes === 0 ? 'Na hora' : `${minutes} min`
}
