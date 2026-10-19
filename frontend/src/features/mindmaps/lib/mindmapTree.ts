import type { MindMapNode } from '@/shared/types'

/**
 * Cor por profundidade. O nivel 0 (raiz) usa a cor da materia, por isso a
 * paleta comeca no nivel 1.
 */
export const BRANCH_COLORS = [
  '#8b5cf6',
  '#4cd7f6',
  '#f59e0b',
  '#ec4899',
  '#14b8a6',
  '#a855f7',
  '#ef4444',
  '#6366f1',
] as const

export type ChildrenMap = Map<string | null, MindMapNode[]>

export function buildChildrenMap(nodes: MindMapNode[]): ChildrenMap {
  const map: ChildrenMap = new Map()
  for (const node of nodes) {
    const siblings = map.get(node.parentId) ?? []
    siblings.push(node)
    map.set(node.parentId, siblings)
  }
  return map
}

export function getRootNode(nodes: MindMapNode[]): MindMapNode | undefined {
  return nodes.find((n) => n.parentId === null)
}

export function findNode(nodes: MindMapNode[], id: string | null): MindMapNode | undefined {
  if (!id) return undefined
  return nodes.find((n) => n.id === id)
}

/**
 * Profundidade do no contando a raiz como 0. Para arvores corrompidas (ciclo ou
 * pai inexistente) a caminhada para no limite do numero de nos.
 */
export function getDepth(nodes: MindMapNode[], id: string): number {
  let depth = 0
  let current = findNode(nodes, id)
  while (current?.parentId && depth < nodes.length) {
    current = findNode(nodes, current.parentId)
    depth++
  }
  return depth
}

export function collectDescendantIds(nodes: MindMapNode[], id: string): string[] {
  const childrenMap = buildChildrenMap(nodes)
  const result: string[] = []
  const queue = [id]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    for (const child of childrenMap.get(currentId) ?? []) {
      result.push(child.id)
      queue.push(child.id)
    }
  }

  return result
}

/** Remove o no e toda a sua subarvore. A raiz nunca e removida. */
export function removeSubtree(nodes: MindMapNode[], id: string): MindMapNode[] {
  const target = findNode(nodes, id)
  if (!target || target.parentId === null) return nodes

  const doomed = new Set([id, ...collectDescendantIds(nodes, id)])
  return nodes.filter((n) => !doomed.has(n.id))
}

/**
 * Nos visiveis no canvas: descendentes de um no recolhido ficam de fora.
 */
export function getVisibleNodes(nodes: MindMapNode[]): MindMapNode[] {
  const collapsed = nodes.filter((n) => n.collapsed).map((n) => n.id)
  if (collapsed.length === 0) return nodes

  const hidden = new Set<string>()
  for (const id of collapsed) {
    for (const descendantId of collectDescendantIds(nodes, id)) {
      hidden.add(descendantId)
    }
  }

  return nodes.filter((n) => !hidden.has(n.id))
}

export function countHiddenDescendants(nodes: MindMapNode[], id: string): number {
  return collectDescendantIds(nodes, id).length
}

export interface MindMapStats {
  total: number
  branches: number
  depth: number
}

export function getMindMapStats(nodes: MindMapNode[]): MindMapStats {
  const childrenMap = buildChildrenMap(nodes)
  const root = getRootNode(nodes)

  return {
    total: nodes.length,
    branches: root ? (childrenMap.get(root.id) ?? []).length : 0,
    depth: nodes.reduce((max, node) => Math.max(max, getDepth(nodes, node.id)), 0),
  }
}

export function getBranchColor(depth: number): string {
  return BRANCH_COLORS[(depth - 1) % BRANCH_COLORS.length]
}

/**
 * Cor efetiva de um no: cor explicita do proprio no, senao a cor herdada do
 * ancestral mais proximo que definiu uma, senao a cor padrao do nivel.
 */
export function resolveNodeColor(
  nodes: MindMapNode[],
  node: MindMapNode,
  rootColor: string
): string {
  if (node.color) return node.color

  let current = findNode(nodes, node.parentId)
  let guard = 0
  while (current && guard < nodes.length) {
    if (current.color) return current.color
    current = findNode(nodes, current.parentId)
    guard++
  }

  const depth = getDepth(nodes, node.id)
  return depth === 0 ? rootColor : getBranchColor(depth)
}

/** Exporta a arvore como lista markdown indentada. */
export function toMarkdown(nodes: MindMapNode[], title: string): string {
  const childrenMap = buildChildrenMap(nodes)
  const root = getRootNode(nodes)
  const lines = [`# ${title}`, '']

  const walk = (node: MindMapNode, depth: number) => {
    const indent = '  '.repeat(Math.max(0, depth - 1))
    if (depth > 0) {
      lines.push(`${indent}- ${node.label}${node.note ? ` — ${node.note}` : ''}`)
    }
    for (const child of childrenMap.get(node.id) ?? []) {
      walk(child, depth + 1)
    }
  }

  if (root) walk(root, 0)
  return lines.join('\n')
}
