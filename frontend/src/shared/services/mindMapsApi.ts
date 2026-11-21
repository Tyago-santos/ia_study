import { api } from '@/shared/services/api'

export interface MindMapNodeApi {
  id: string
  label: string
  note: string | null
  color: string | null
  collapsed: boolean
  positionX: number | null
  positionY: number | null
  mindMapId: string
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export interface MindMapApi {
  id: string
  title: string
  description: string | null
  userId: string
  subjectId: string
  nodes: MindMapNodeApi[]
  createdAt: string
  updatedAt: string
}

export interface MindMapCreatePayload {
  title: string
  subjectId: string
  description?: string | null
}

export interface MindMapUpdatePayload {
  title?: string
  description?: string | null
}

export interface MindMapNodePayload {
  label: string
  note?: string | null
  color?: string | null
  parentId?: string | null
  positionX?: number | null
  positionY?: number | null
  collapsed?: boolean
}

export const mindMapsApi = {
  list: () => api.get<MindMapApi[]>('/mind-maps'),

  get: (id: string) => api.get<MindMapApi>(`/mind-maps/${id}`),

  create: (data: MindMapCreatePayload) =>
    api.post<MindMapApi>('/mind-maps', {
      title: data.title,
      subjectId: data.subjectId,
      description: data.description ?? null,
    }),

  updateMeta: (id: string, data: MindMapUpdatePayload) =>
    api.patch<MindMapApi>(`/mind-maps/${id}`, {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description ?? null }),
    }),

  remove: (id: string) => api.delete<{ message: string }>(`/mind-maps/${id}`),

  // Nodes
  createNode: (mindMapId: string, data: MindMapNodePayload) =>
    api.post<MindMapNodeApi>(`/mind-maps/${mindMapId}/nodes`, data),

  updateNode: (mindMapId: string, nodeId: string, data: Partial<MindMapNodePayload>) =>
    api.patch<MindMapNodeApi>(`/mind-maps/${mindMapId}/nodes/${nodeId}`, data),

  deleteNode: (mindMapId: string, nodeId: string) =>
    api.delete<{ message: string }>(`/mind-maps/${mindMapId}/nodes/${nodeId}`),
}
