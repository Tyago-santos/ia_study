import { api } from '@/shared/services/api'

/**
 * Mapas mentais no backend real. O model `MindMap` cobre so' os metadados
 * (titulo, descricao, materia). A arvore de topicos (`MindMapNode`) existe no
 * schema do Prisma mas NAO TEM rota nenhuma (sem controller/router) — por isso
 * esta API nao expõe nada de nos. Ver `mindmaps.service.ts` para o motivo de a
 * edicao de arvore continuar mockada.
 */
export interface MindMapNodeApi {
  id: string
  label: string
  note?: string | null
  color?: string | null
  collapsed: boolean
  positionX?: number | null
  positionY?: number | null
  mindMapId: string
  parentId?: string | null
}

export interface MindMapApi {
  id: string
  title: string
  description?: string | null
  userId: string
  subjectId: string
  nodes: MindMapNodeApi[]
  createdAt: string
  updatedAt: string
}

export const mindMapsApi = {
  list: () => api.get<MindMapApi[]>('/mind-maps'),

  get: (id: string) => api.get<MindMapApi>(`/mind-maps/${id}`),

  create: (data: { title: string; description?: string; subjectId: string }) =>
    api.post<MindMapApi>('/mind-maps', data),

  updateMeta: (id: string, data: { title?: string; description?: string }) =>
    api.patch<MindMapApi>(`/mind-maps/${id}`, data),

  remove: (id: string) => api.delete<{ message: string }>(`/mind-maps/${id}`),
}
