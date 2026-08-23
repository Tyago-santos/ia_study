import { FileText, Image, Upload } from 'lucide-react'
import type { Summary } from '@/shared/types'

export const SOURCE_TYPE_STYLES = {
  text: { label: 'Texto', icon: FileText },
  pdf: { label: 'PDF', icon: Upload },
  image: { label: 'Imagem', icon: Image },
} as const

export function getSourceStyle(sourceType: Summary['sourceType']) {
  return SOURCE_TYPE_STYLES[sourceType] ?? SOURCE_TYPE_STYLES.text
}

export function countBySourceType(
  summaries: Summary[] | undefined,
  sourceType: Summary['sourceType']
): number {
  return summaries?.filter((s) => s.sourceType === sourceType).length ?? 0
}
