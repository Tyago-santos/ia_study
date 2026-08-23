import type { MindMapNode } from '@/shared/types'
import { buildChildrenMap, getRootNode } from './mindmapTree'

export const NODE_WIDTH = 190
export const ROOT_WIDTH = 210
/** Altura nominal de um no, usada para converter centro em canto superior. */
const NODE_HEIGHT = 46
/** Espaco vertical reservado para cada folha. */
const SLOT_HEIGHT = 62
/** Distancia horizontal entre os centros de dois niveis. */
const LEVEL_GAP = 250

export type NodeSide = 'root' | 'left' | 'right'

export interface NodeLayout {
  x: number
  y: number
  depth: number
  side: NodeSide
}

export type LayoutMap = Map<string, NodeLayout>

/**
 * Layout de mapa mental classico: a raiz fica no centro e os ramos de primeiro
 * nivel sao divididos entre os dois lados, crescendo horizontalmente para fora.
 *
 * A altura de cada subarvore e a soma das alturas dos filhos, o que garante que
 * ramos irmaos nunca se sobreponham. Recebe apenas os nos visiveis — subarvores
 * recolhidas devem ser filtradas antes.
 *
 * As posicoes calculadas internamente sao centros; o retorno ja converte para o
 * canto superior esquerdo, que e o que o React Flow espera.
 */
export function layoutMindMap(visibleNodes: MindMapNode[]): LayoutMap {
  const layout: LayoutMap = new Map()
  const root = getRootNode(visibleNodes)
  if (!root) return layout

  const childrenMap = buildChildrenMap(visibleNodes)
  const heights = new Map<string, number>()

  const measure = (nodeId: string): number => {
    const cached = heights.get(nodeId)
    if (cached !== undefined) return cached

    const children = childrenMap.get(nodeId) ?? []
    const height = children.length
      ? children.reduce((sum, child) => sum + measure(child.id), 0)
      : SLOT_HEIGHT

    heights.set(nodeId, height)
    return height
  }

  const setPosition = (nodeId: string, centerX: number, centerY: number, depth: number, side: NodeSide) => {
    const width = depth === 0 ? ROOT_WIDTH : NODE_WIDTH
    layout.set(nodeId, {
      x: centerX - width / 2,
      y: centerY - NODE_HEIGHT / 2,
      depth,
      side,
    })
  }

  const place = (nodeId: string, depth: number, top: number, side: NodeSide) => {
    const height = measure(nodeId)
    const direction = side === 'left' ? -1 : 1

    setPosition(nodeId, direction * depth * LEVEL_GAP, top + height / 2, depth, side)

    let cursor = top
    for (const child of childrenMap.get(nodeId) ?? []) {
      place(child.id, depth + 1, cursor, side)
      cursor += measure(child.id)
    }
  }

  const rootChildren = childrenMap.get(root.id) ?? []
  // Ramos alternam de lado para manter o mapa equilibrado mesmo com poucos ramos.
  const rightBranches = rootChildren.filter((_, i) => i % 2 === 0)
  const leftBranches = rootChildren.filter((_, i) => i % 2 === 1)

  const placeSide = (branches: MindMapNode[], side: NodeSide) => {
    const totalHeight = branches.reduce((sum, branch) => sum + measure(branch.id), 0)
    let cursor = -totalHeight / 2
    for (const branch of branches) {
      place(branch.id, 1, cursor, side)
      cursor += measure(branch.id)
    }
  }

  placeSide(rightBranches, 'right')
  placeSide(leftBranches, 'left')

  setPosition(root.id, 0, 0, 0, 'root')

  return layout
}
