import type { MindMapNode } from '@/shared/types'
import { Tints } from '@/shared/constants/theme'

export const NODE_WIDTH = 140
export const NODE_HEIGHT = 46
/** Distancia horizontal entre um no e seus filhos. */
export const COLUMN_GAP = 190
/** Altura reservada para cada folha; define o espacamento vertical da arvore. */
export const ROW_GAP = 64
export const CANVAS_PADDING = 40

/**
 * Paleta dos ramos principais, na mesma ordem das cores de materia do app.
 * Cada ramo direto da raiz pega a proxima cor; os descendentes herdam.
 */
export const BRANCH_PALETTE = [
  Tints.green,
  Tints.amber,
  Tints.cyan,
  Tints.violet,
  Tints.red,
  Tints.emerald,
]

/**
 * Cor efetiva de cada no, resolvida de cima para baixo:
 *
 * - A raiz nao tem cor propria (fica com o acento da materia).
 * - Cada filho direto da raiz ganha a proxima cor da paleta — e o que faz os
 *   ramos ficarem visualmente distintos sem ninguem escolher nada.
 * - Os descendentes herdam a cor do pai; uma cor escolhida manualmente
 *   (`node.color`) vence a heranca em qualquer nivel.
 */
export function resolveBranchColors(
  nodes: MindMapNode[],
  palette: string[] = BRANCH_PALETTE,
): Map<string, string | undefined> {
  const childrenOf = new Map<string, MindMapNode[]>()
  for (const node of nodes) {
    if (!node.parentId) continue
    childrenOf.set(node.parentId, [...(childrenOf.get(node.parentId) ?? []), node])
  }

  const resolved = new Map<string, string | undefined>()
  let nextBranch = 0

  const walk = (node: MindMapNode, inherited?: string): void => {
    let own: string | undefined

    if (!node.parentId) {
      own = undefined
    } else if (inherited === undefined) {
      own = node.color ?? palette[nextBranch++ % palette.length]
    } else {
      own = node.color ?? inherited
    }

    resolved.set(node.id, own)
    for (const child of childrenOf.get(node.id) ?? []) {
      walk(child, own)
    }
  }

  for (const root of nodes.filter((n) => !n.parentId)) {
    walk(root)
  }

  return resolved
}

export interface PositionedNode {
  node: MindMapNode
  depth: number
  x: number
  y: number
}

export interface MindMapLayout {
  nodes: PositionedNode[]
  positionById: Map<string, { x: number; y: number }>
  width: number
  height: number
}

/**
 * Layout de arvore da esquerda para a direita.
 *
 * Cada folha ocupa uma faixa vertical propria e cada pai fica centrado no bloco
 * dos seus filhos — e a primeira passada do algoritmo "tidy tree". Isso evita
 * que ramos se sobreponham, coisa que um simples "y = indice" causaria assim
 * que um ramo tivesse mais filhos que outro.
 */
export function layoutMindMap(nodes: MindMapNode[]): MindMapLayout {
  const childrenOf = new Map<string | null, MindMapNode[]>()
  for (const node of nodes) {
    childrenOf.set(node.parentId, [...(childrenOf.get(node.parentId) ?? []), node])
  }

  const positioned: PositionedNode[] = []
  const positionById = new Map<string, { x: number; y: number }>()
  let nextLeafSlot = 0

  const place = (node: MindMapNode, depth: number): number => {
    const children = childrenOf.get(node.id) ?? []
    let y: number

    if (children.length === 0) {
      y = nextLeafSlot * ROW_GAP
      nextLeafSlot += 1
    } else {
      const childYs = children.map((child) => place(child, depth + 1))
      y = (childYs[0] + childYs[childYs.length - 1]) / 2
    }

    const x = depth * COLUMN_GAP
    positioned.push({ node, depth, x, y })
    positionById.set(node.id, { x, y })
    return y
  }

  for (const root of childrenOf.get(null) ?? []) {
    place(root, 0)
  }

  const maxX = positioned.reduce((max, p) => Math.max(max, p.x), 0)
  const maxY = positioned.reduce((max, p) => Math.max(max, p.y), 0)

  return {
    nodes: positioned,
    positionById,
    width: maxX + NODE_WIDTH + CANVAS_PADDING * 2,
    height: maxY + NODE_HEIGHT + CANVAS_PADDING * 2,
  }
}

export interface Edge {
  id: string
  /** Ponto medio da linha, ja no sistema do canvas. */
  centerX: number
  centerY: number
  length: number
  /** Angulo em graus, para rotacionar a View que desenha a linha. */
  angle: number
}

/**
 * Liga a borda direita do pai a borda esquerda do filho. Sem `react-native-svg`
 * cada aresta e uma View fina rotacionada, entao o que interessa e o centro,
 * o comprimento e o angulo do segmento.
 */
export function buildEdges(layout: MindMapLayout, nodes: MindMapNode[]): Edge[] {
  const edges: Edge[] = []

  for (const node of nodes) {
    if (!node.parentId) continue

    const parent = layout.positionById.get(node.parentId)
    const child = layout.positionById.get(node.id)
    if (!parent || !child) continue

    const fromX = parent.x + NODE_WIDTH
    const fromY = parent.y + NODE_HEIGHT / 2
    const toX = child.x
    const toY = child.y + NODE_HEIGHT / 2

    const dx = toX - fromX
    const dy = toY - fromY

    edges.push({
      id: node.id,
      centerX: (fromX + toX) / 2,
      centerY: (fromY + toY) / 2,
      length: Math.sqrt(dx * dx + dy * dy),
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    })
  }

  return edges
}
