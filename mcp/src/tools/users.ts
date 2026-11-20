import { z } from "zod";

import { apiTool } from "./_factory.js";

export const userTools = [
  apiTool({ name: "get_me", description: "Retorna o perfil do usuário autenticado.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/users/me" }),
  apiTool({ name: "get_user", description: "Busca um usuário pelo id.", profile: "full", schema: z.object({ id: z.uuid() }), annotations: { readOnlyHint: true }, method: "GET", path: (a) => `/users/${a.id}` }),
  apiTool({
    name: "create_user",
    description: "Cria um novo usuário (cadastro).",
    profile: "full",
    schema: z.object({
      name: z.string().min(2).max(30),
      email: z.email(),
      password: z.string().min(6),
    }),
    method: "POST",
    path: () => "/users",
    body: (a) => a,
  }),
  apiTool({
    name: "update_user",
    description: "Atualiza nome/email/senha de um usuário.",
    profile: "full",
    schema: z
      .object({
        id: z.uuid(),
        name: z.string().min(2).max(30).optional(),
        email: z.email().optional(),
        password: z.string().min(6).optional(),
      })
      .refine((d) => d.name !== undefined || d.email !== undefined || d.password !== undefined, { message: "Informe ao menos um campo" }),
    method: "PATCH",
    path: (a) => `/users/${a.id}`,
    body: (a) => {
      const { id: _id, ...rest } = a;
      return rest;
    },
  }),
  apiTool({
    name: "delete_user",
    description: "Exclui um usuário pelo id.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/users/${a.id}`,
  }),
];
