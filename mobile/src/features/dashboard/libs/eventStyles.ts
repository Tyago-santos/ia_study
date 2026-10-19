import type { Ionicons } from '@expo/vector-icons'
import { Tints } from '@/shared/constants/theme'
import type { ScheduleEvent } from '@/shared/types'

/** Cor e icone por tipo de compromisso, iguais nos tres temas. */
export const EVENT_COLORS: Record<ScheduleEvent['type'], string> = {
  prova: Tints.red,
  estudo: Tints.indigo,
  trabalho: Tints.amber,
  aula: Tints.violet,
  outro: Tints.cyan,
}

export const EVENT_ICONS: Record<ScheduleEvent['type'], keyof typeof Ionicons.glyphMap> = {
  prova: 'school',
  estudo: 'book',
  trabalho: 'briefcase',
  aula: 'easel-outline',
  outro: 'ellipsis-horizontal',
}
