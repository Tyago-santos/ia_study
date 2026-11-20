import { z } from "zod";

import { apiTool } from "./_factory.js";

export const subjectTools = [
  apiTool({
    name: "list_subjects",
    description: "Lista todas as matérias do usuário.",
    profile: "core",
    schema: z.object({}),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/subjects",
  }),
  apiTool({
    name: "create_subject",
    description: "Cria uma nova matéria.",
    profile: "full",
    schema: z.object({
      name: z.string().min(1).max(100),
      color: z.string().min(1),
      icon: z.string().optional(),
    }),
    annotations: { idempotentHint: false },
    method: "POST",
    path: () => "/subjects",
    body: (a) => a,
  }),
  apiTool({
    name: "delete_subject",
    description: "Exclui uma matéria pelo id.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/subjects/${a.id}`,
  }),
];
