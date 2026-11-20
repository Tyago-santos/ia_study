import { z } from "zod";

import { apiTool } from "./_factory.js";

const nodeSchema = z.object({
  label: z.string().min(1).max(200),
  note: z.string().optional(),
  color: z.string().optional(),
  parentId: z.uuid().nullable().optional(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  collapsed: z.boolean().optional(),
});

export const mindMapTools = [
  apiTool({
    name: "list_mind_maps",
    description: "Lista todos os mapas mentais do usuário.",
    profile: "core",
    schema: z.object({}),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/mind-maps",
  }),
  apiTool({
    name: "get_mind_map",
    description: "Busca um mapa mental pelo id.",
    profile: "core",
    schema: z.object({ id: z.uuid() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: (a) => `/mind-maps/${a.id}`,
  }),
  apiTool({
    name: "create_mind_map",
    description: "Cria um novo mapa mental.",
    profile: "full",
    schema: z.object({
      title: z.string().min(1).max(100),
      description: z.string().optional(),
      subjectId: z.uuid(),
    }),
    method: "POST",
    path: () => "/mind-maps",
    body: (a) => a,
  }),
  apiTool({
    name: "update_mind_map",
    description: "Atualiza título e/ou descrição de um mapa mental.",
    profile: "full",
    schema: z
      .object({
        id: z.uuid(),
        title: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
      })
      .refine((d) => d.title !== undefined || d.description !== undefined, { message: "Informe ao menos um campo" }),
    method: "PATCH",
    path: (a) => `/mind-maps/${a.id}`,
    body: (a) => ({ title: a.title, description: a.description }),
  }),
  apiTool({
    name: "delete_mind_map",
    description: "Exclui um mapa mental pelo id.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/mind-maps/${a.id}`,
  }),
  apiTool({
    name: "create_mind_map_node",
    description: "Adiciona um tópico (nó) a um mapa mental. Use parentId para criar sub-tópicos.",
    profile: "full",
    schema: z.object({
      mindMapId: z.uuid(),
      label: z.string().min(1).max(200),
      note: z.string().optional(),
      color: z.string().optional(),
      parentId: z.uuid().nullable().optional(),
      positionX: z.number().optional(),
      positionY: z.number().optional(),
      collapsed: z.boolean().optional(),
    }),
    method: "POST",
    path: (a) => `/mind-maps/${a.mindMapId}/nodes`,
    body: (a) => {
      const { mindMapId: _m, ...rest } = a;
      return rest;
    },
  }),
  apiTool({
    name: "update_mind_map_node",
    description: "Atualiza um tópico (nó) de um mapa mental.",
    profile: "full",
    schema: z
      .object({
        mindMapId: z.uuid(),
        nodeId: z.uuid(),
        label: z.string().min(1).max(200).optional(),
        note: z.string().nullable().optional(),
        color: z.string().nullable().optional(),
        parentId: z.uuid().nullable().optional(),
        positionX: z.number().nullable().optional(),
        positionY: z.number().nullable().optional(),
        collapsed: z.boolean().optional(),
      })
      .refine((d) => Object.keys(d).length > 2, { message: "Informe ao menos um campo" }),
    method: "PATCH",
    path: (a) => `/mind-maps/${a.mindMapId}/nodes/${a.nodeId}`,
    body: (a) => {
      const { mindMapId: _m, nodeId: _n, ...rest } = a;
      return rest;
    },
  }),
  apiTool({
    name: "delete_mind_map_node",
    description: "Remove um tópico (nó) de um mapa mental.",
    profile: "full",
    schema: z.object({ mindMapId: z.uuid(), nodeId: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/mind-maps/${a.mindMapId}/nodes/${a.nodeId}`,
  }),
];
