import type { Edge, Node } from '@xyflow/react'
import type { MindMapNode } from '@/shared/types'
import { NODE_WIDTH, ROOT_WIDTH, layoutMindMap, type NodeSide } from './layout'
import {
  buildChildrenMap,
  countHiddenDescendants,
  getVisibleNodes,
  resolveNodeColor,
} from './mindmapTree'

export interface MindMapNodeData extends Record<string, unknown> {
  label: string
  note?: string
  color: string
  depth: number
  side: NodeSide
  width: number
  childCount: number
  collapsed: boolean
  hiddenCount: number
}

export type MindMapFlowNode = Node<MindMapNodeData, 'mindmap'>

export interface FlowGraph {
  nodes: MindMapFlowNode[]
  edges: Edge[]
}

/**
 * Converte a arvore de dominio no grafo que o React Flow renderiza.
 *
 * Nos com `position` propria (arrastados pelo usuario) mantem essa posicao; os
 * demais seguem o layout automatico.
 */
export function toFlowGraph(nodes: MindMapNode[], rootColor: string): FlowGraph {
  const visible = getVisibleNodes(nodes)
  const layout = layoutMindMap(visible)
  const childrenMap = buildChildrenMap(nodes)

  const flowNodes: MindMapFlowNode[] = visible.map((node) => {
    const position = layout.get(node.id) ?? { x: 0, y: 0, depth: 0, side: 'root' as NodeSide }
    const childCount = (childrenMap.get(node.id) ?? []).length

    return {
      id: node.id,
      type: 'mindmap',
      position: node.position ?? { x: position.x, y: position.y },
      data: {
        label: node.label,
        note: node.note,
        color: resolveNodeColor(nodes, node, rootColor),
        depth: position.depth,
        side: position.side,
        width: position.depth === 0 ? ROOT_WIDTH : NODE_WIDTH,
        childCount,
        collapsed: Boolean(node.collapsed),
        hiddenCount: node.collapsed ? countHiddenDescendants(nodes, node.id) : 0,
      },
      // A raiz nao pode ser apagada pelo teclado do React Flow.
      deletable: node.parentId !== null,
    }
  })

  const visibleIds = new Set(visible.map((n) => n.id))
  const edges: Edge[] = visible
    .filter((node) => node.parentId !== null && visibleIds.has(node.parentId))
    .map((node) => {
      const childLayout = layout.get(node.id)
      const side: NodeSide = childLayout?.side ?? 'right'
      const color = resolveNodeColor(nodes, node, rootColor)

      return {
        id: `${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        // O lado define de qual handle a aresta sai e em qual ela chega.
        sourceHandle: side === 'left' ? 'source-left' : 'source-right',
        targetHandle: side === 'left' ? 'target-right' : 'target-left',
        type: 'smoothstep',
        style: { stroke: color, strokeWidth: 2, opacity: 0.75 },
        selectable: false,
        deletable: false,
      }
    })

  return { nodes: flowNodes, edges }
}
