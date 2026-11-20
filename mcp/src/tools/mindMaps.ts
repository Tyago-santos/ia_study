import { z } from "zod";

import { apiTool } from "./_factory.js";

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
];
