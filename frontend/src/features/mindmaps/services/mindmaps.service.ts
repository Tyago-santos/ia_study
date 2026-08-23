import { delay } from '@/shared/mocks/helpers'
import { mindMapsApi, type MindMapApi } from '@/shared/services/mindMapsApi'
import type { MindMap, MindMapNode } from '@/shared/types'
import { createStarterNodes, generateMindMapNodes } from '@/features/mindmaps/lib/generator'

/**
 * Arvore de topicos (`MindMapNode`) mantida so' em memoria, por mapa. O
 * backend tem o model `MindMapNode` no schema do Prisma, mas nenhuma rota
 * (sem controller/router/repository) para criar, editar ou apagar nos — so'
 * `title`/`description` do mapa em si sao reais (`GET/POST/PATCH/DELETE
 * /mind-maps`). Enquanto isso nao existir, qualquer edicao de arvore se
 * perde ao recarregar a pagina.
 * TODO(backend): trocar por persistencia real quando existirem rotas de MindMapNode.
 */
const localNodes = new Map<string, MindMapNode[]>()

function toMindMap(map: MindMapApi): MindMap {
  return {
    id: map.id,
    subjectId: map.subjectId,
    title: map.title,
    description: map.description ?? undefined,
    nodes: localNodes.get(map.id) ?? [],
    createdAt: map.createdAt,
    updatedAt: map.updatedAt,
  }
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
      description: data.description,
      subjectId: data.subjectId,
    })
    // Sem rota de MindMapNode no backend: guarda a arvore inicial (gerada por
    // IA ou o esqueleto padrao) so' em memoria local, ver comentario acima.
    localNodes.set(created.id, data.nodes ?? createStarterNodes(data.title))
    return toMindMap(created)
  },

  update: async (data: { id: string; title?: string; description?: string }) => {
    const updated = await mindMapsApi.updateMeta(data.id, {
      title: data.title,
      description: data.description,
    })
    return toMindMap(updated)
  },

  // TODO(backend): sem rota de MindMapNode, isso so' atualiza o cache local —
  // nao persiste de verdade no servidor.
  updateNodes: async (data: { id: string; nodes: MindMapNode[] }) => {
    localNodes.set(data.id, [...data.nodes])
    const map = await mindMapsApi.get(data.id)
    return delay({ ...toMindMap(map), updatedAt: new Date().toISOString() })
  },

  remove: async (id: string) => {
    await mindMapsApi.remove(id)
    localNodes.delete(id)
    return { id }
  },

  /**
   * Geracao simulada. A estrutura vem de `generateMindMapNodes`, que e o ponto
   * unico a trocar quando a IA real for conectada. O backend `mindMap` nao tem
   * nenhum endpoint de geracao por IA hoje.
   */
  generateWithAI: async (data: { topic: string; content?: string }) => {
    return delay({ nodes: generateMindMapNodes(data) })
  },
}
