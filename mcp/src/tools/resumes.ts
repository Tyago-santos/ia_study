import { z } from "zod";

import { apiTool } from "./_factory.js";

export const resumeTools = [
  apiTool({
    name: "list_resumes",
    description: "Lista resumos, opcionalmente filtrados por matéria.",
    profile: "core",
    schema: z.object({ subjectId: z.uuid().optional() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/resumes",
    query: (a) => ({ subjectId: a.subjectId }),
  }),
  apiTool({
    name: "get_resume",
    description: "Busca um resumo pelo id.",
    profile: "core",
    schema: z.object({ id: z.uuid() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: (a) => `/resumes/${a.id}`,
  }),
  apiTool({
    name: "create_resume",
    description: "Cria um novo resumo.",
    profile: "full",
    schema: z.object({
      name: z.string().min(1).max(100),
      content: z.string().min(1),
      subjectId: z.string().uuid(),
      sourceType: z.enum(["text", "pdf", "image"]).default("text"),
    }),
    method: "POST",
    path: () => "/resumes",
    body: (a) => a,
  }),
  apiTool({
    name: "update_resume",
    description: "Atualiza nome e/ou conteúdo de um resumo.",
    profile: "full",
    schema: z
      .object({
        id: z.uuid(),
        name: z.string().min(1).max(100).optional(),
        content: z.string().optional(),
      })
      .refine((d) => d.name !== undefined || d.content !== undefined, { message: "Informe ao menos um campo" }),
    method: "PATCH",
    path: (a) => `/resumes/${a.id}`,
    body: (a) => ({ name: a.name, content: a.content }),
  }),
  apiTool({
    name: "delete_resume",
    description: "Exclui um resumo pelo id.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/resumes/${a.id}`,
  }),
];
