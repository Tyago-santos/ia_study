import type { MindMapNode } from '@/shared/types'

let generatedCounter = 0

/**
 * Id local de no. Baseado em contador em vez de `crypto.randomUUID` porque o
 * dev server roda em http na rede local, onde a Web Crypto nao esta disponivel.
 */
export function newNodeId(): string {
  return `n_${Date.now().toString(36)}_${++generatedCounter}`
}

const newId = newNodeId

/** Primeira letra maiuscula, sem alterar o resto do texto. */
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Corta um texto em um rotulo curto o suficiente para caber em um no. */
function toLabel(text: string, maxLength = 46): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return capitalize(clean)
  const cut = clean.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return capitalize((lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trim())
}

/** Arvore inicial de um mapa criado manualmente: raiz + tres ramos vazios. */
export function createStarterNodes(title: string): MindMapNode[] {
  const rootId = newId()
  return [
    { id: rootId, parentId: null, label: toLabel(title, 40) },
    { id: newId(), parentId: rootId, label: 'Primeiro ramo' },
    { id: newId(), parentId: rootId, label: 'Segundo ramo' },
    { id: newId(), parentId: rootId, label: 'Terceiro ramo' },
  ]
}
