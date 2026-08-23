import { BookOpen, Moon, Sun } from 'lucide-react'
import type { Theme } from '@/shared/types'

export const THEME_OPTIONS: {
  value: Theme
  label: string
  icon: typeof Sun
  description: string
}[] = [
  { value: 'light', label: 'Claro', icon: Sun, description: 'Tema claro para uso durante o dia' },
  { value: 'dark', label: 'Escuro', icon: Moon, description: 'Tema escuro para uso à noite' },
  {
    value: 'reading',
    label: 'Leitura',
    icon: BookOpen,
    description: 'Tema otimizado para leitura prolongada',
  },
]

export const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Pequeno' },
  { value: 'medium', label: 'Normal' },
  { value: 'large', label: 'Grande' },
] as const

export const LANGUAGE_OPTIONS = [
  { value: 'pt-BR', label: 'Português' },
  { value: 'en', label: 'Inglês' },
  { value: 'es', label: 'Espanhol' },
]

export type FontSize = (typeof FONT_SIZE_OPTIONS)[number]['value']
