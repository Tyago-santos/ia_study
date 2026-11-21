import {
  mindMapsApi,
  type MindMapApi,
  type MindMapNodeApi,
  type MindMapNodePayload,
} from '@/shared/services/mindMapsApi'
import type { MindMap, MindMapNode } from '@/shared/types'
import { createStarterNodes } from '@/features/mindmaps/lib/generator'

function toMindMap(map: MindMapApi): MindMap {
  return {
    id: map.id,
    subjectId: map.subjectId,
    title: map.title,
    description: map.description ?? undefined,
    nodes: (map.nodes ?? []).map(toNode),
    createdAt: map.createdAt,
    updatedAt: map.updatedAt,
  }
}

function toNode(node: MindMapNodeApi): MindMapNode {
  return {
    id: node.id,
    label: node.label,
    note: node.note ?? undefined,
    color: node.color ?? undefined,
    collapsed: node.collapsed,
    position:
      node.positionX !== null && node.positionY !== null
        ? { x: node.positionX, y: node.positionY }
        : undefined,
    parentId: node.parentId,
  }
}

function toNodePayload(node: MindMapNode, parentId = node.parentId ?? null): MindMapNodePayload {
  return {
    label: node.label,
    note: node.note ?? null,
    color: node.color ?? null,
    collapsed: node.collapsed ?? false,
    positionX: node.position?.x ?? null,
    positionY: node.position?.y ?? null,
    parentId,
  }
}

/**
 * Persiste uma arvore local (ids temporarios) no backend, criando pais antes
 * dos filhos. Retorna o mapa `id local -> id do servidor`.
 */
async function persistTree(
  mindMapId: string,
  nodes: MindMapNode[]
): Promise<Record<string, string>> {
  const idMap: Record<string, string> = {}
  const knownIds = new Set(nodes.map((node) => node.id))
  const pending = [...nodes]

  while (pending.length > 0) {
    const index = pending.findIndex(
      (node) =>
        !node.parentId || !knownIds.has(node.parentId) || idMap[node.parentId] !== undefined
    )

    // Arvore com ciclo (nao deveria acontecer): evita loop infinito.
    if (index === -1) break

    const [node] = pending.splice(index, 1)
    const parentId = node.parentId ? (idMap[node.parentId] ?? null) : null
    const created = await mindMapsApi.createNode(mindMapId, toNodePayload(node, parentId))
    idMap[node.id] = created.id
  }

  return idMap
}

export const mindmapsService = {
  getAll: async (params?: { subjectId?: string }) => {
    const maps = await mindMapsApi.list()
    const filtered = params?.subjectId
      ? maps.filter((m) => m.subjectId === params.subjectId)
      : maps
    return filtered.map(toMindMap)
  },

  getById: async (id: string) => {
    const map = await mindMapsApi.get(id)
    return toMindMap(map)
  },

  create: async (data: {
    subjectId: string
    title: string
    description?: string
    nodes?: MindMapNode[]
  }) => {
    const created = await mindMapsApi.create({
      title: data.title,
      subjectId: data.subjectId,
      description: data.description ?? null,
    })

    const tree = data.nodes ?? createStarterNodes(data.title)
    if (tree.length > 0) {
      await persistTree(created.id, tree)
    }

    // Rebusca para devolver o mapa ja' com os nos persistidos.
    const withNodes = await mindMapsApi.get(created.id)
    return toMindMap(withNodes)
  },

  update: async (data: { id: string; title?: string; description?: string }) => {
    const updated = await mindMapsApi.updateMeta(data.id, {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
    })
    return toMindMap(updated)
  },

  // Nodes — persistem no backend
  createNode: async (mindMapId: string, data: MindMapNodePayload) => {
    const created = await mindMapsApi.createNode(mindMapId, data)
    return toNode(created)
  },

  updateNode: async (mindMapId: string, nodeId: string, data: Partial<MindMapNodePayload>) => {
    const updated = await mindMapsApi.updateNode(mindMapId, nodeId, data)
    return toNode(updated)
  },

  deleteNode: async (mindMapId: string, nodeId: string) => {
    await mindMapsApi.deleteNode(mindMapId, nodeId)
    return { id: nodeId }
  },

  remove: async (id: string) => {
    await mindMapsApi.remove(id)
    return { id }
  },

  /**
   * Salva a arvore do editor comparando com a versao original: remove nos
   * apagados, cria os novos e atualiza os alterados. Retorna o mapa de ids
   * temporarios para os ids definitivos, para o editor se sincronizar.
   */
  saveNodes: async (
    mindMapId: string,
    currentNodes: MindMapNode[],
    originalNodes: MindMapNode[]
  ): Promise<{ idMap: Record<string, string> }> => {
    const originalById = new Map(originalNodes.map((node) => [node.id, node]))
    const currentById = new Map(currentNodes.map((node) => [node.id, node]))

    // 1. Remover nos que nao existem mais
    for (const original of originalNodes) {
      if (!currentById.has(original.id)) {
        await mindMapsApi.deleteNode(mindMapId, original.id)
      }
    }

    // 2. Criar os novos (pais antes dos filhos)
    const newNodes = currentNodes.filter((node) => !originalById.has(node.id))
    const idMap = await persistTree(mindMapId, newNodes)

    // 3. Atualizar os existentes alterados
    for (const current of currentNodes) {
      const original = originalById.get(current.id)
      if (!original) continue

      const changed =
        current.label !== original.label ||
        current.note !== original.note ||
        current.color !== original.color ||
        current.collapsed !== original.collapsed ||
        current.position?.x !== original.position?.x ||
        current.position?.y !== original.position?.y ||
        current.parentId !== original.parentId

      if (changed) {
        const parentId = current.parentId ? (idMap[current.parentId] ?? current.parentId) : null
        await mindMapsApi.updateNode(mindMapId, current.id, toNodePayload(current, parentId))
      }
    }

    return { idMap }
  },
}
