import type { MindMap } from '@/shared/types'
import { toMarkdown } from './mindmapTree'

function download(filename: string, content: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Nome de arquivo seguro derivado do titulo. O `normalize` separa os acentos
 * para que "Funcao Composta" vire "funcao-composta" em vez de perder as letras.
 */
function toSlug(title: string): string {
  return (
    title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'mapa-mental'
  )
}

export function exportAsMarkdown(mindMap: MindMap) {
  download(
    `${toSlug(mindMap.title)}.md`,
    toMarkdown(mindMap.nodes, mindMap.title),
    'text/markdown;charset=utf-8'
  )
}

export function exportAsJson(mindMap: MindMap) {
  download(
    `${toSlug(mindMap.title)}.json`,
    JSON.stringify(mindMap, null, 2),
    'application/json;charset=utf-8'
  )
}
