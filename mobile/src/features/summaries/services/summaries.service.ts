import type { Ionicons } from '@expo/vector-icons'
import type { Summary } from '@/shared/types'

/** Icone por origem do resumo (digitado, PDF, foto). */
export const SOURCE_ICONS: Record<Summary['sourceType'], keyof typeof Ionicons.glyphMap> = {
  text: 'document-text',
  pdf: 'document',
  image: 'image',
}

export interface SummaryDraft {
  title: string
  content: string
  subjectId: string | null
}

/** Resumo sem materia, titulo ou texto nao pode ser salvo. */
export function isDraftValid(draft: SummaryDraft): boolean {
  return Boolean(draft.subjectId && draft.title.trim() && draft.content.trim())
}
