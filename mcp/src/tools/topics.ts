import { z } from "zod";

import { apiTool } from "./_factory.js";

export const topicTools = [
  apiTool({
    name: "list_topics",
    description: "Lista tópicos, opcionalmente filtrados por matéria.",
    profile: "core",
    schema: z.object({ subjectId: z.uuid().optional() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/topics",
    query: (a) => ({ subjectId: a.subjectId }),
  }),
  apiTool({
    name: "create_topic",
    description: "Cria um novo tópico em uma matéria.",
    profile: "full",
    schema: z.object({ subjectId: z.uuid(), name: z.string().min(1).max(150) }),
    method: "POST",
    path: () => "/topics",
    body: (a) => a,
  }),
  apiTool({
    name: "toggle_topic",
    description: "Alterna o status de conclusão de um tópico.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    method: "PATCH",
    path: (a) => `/topics/${a.id}/toggle`,
  }),
  apiTool({
    name: "delete_topic",
    description: "Exclui um tópico pelo id.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/topics/${a.id}`,
  }),
];
