import { z } from "zod";

import { apiTool } from "./_factory.js";

export const conversationTools = [
  apiTool({ name: "list_conversations", description: "Lista conversas do usuário.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/conversations" }),
  apiTool({
    name: "create_conversation",
    description: "Cria uma nova conversa.",
    profile: "full",
    schema: z.object({ title: z.string().min(1).max(100).optional() }),
    method: "POST",
    path: () => "/conversations",
    body: (a) => a,
  }),
  apiTool({
    name: "rename_conversation",
    description: "Renomeia uma conversa.",
    profile: "full",
    schema: z.object({ id: z.uuid(), title: z.string().min(1).max(100) }),
    method: "PATCH",
    path: (a) => `/conversations/${a.id}`,
    body: (a) => ({ title: a.title }),
  }),
  apiTool({
    name: "delete_conversation",
    description: "Exclui uma conversa.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/conversations/${a.id}`,
  }),
  apiTool({
    name: "list_messages",
    description: "Lista mensagens de uma conversa.",
    profile: "core",
    schema: z.object({ id: z.uuid() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: (a) => `/conversations/${a.id}/messages`,
  }),
  apiTool({
    name: "add_message",
    description: "Adiciona uma mensagem a uma conversa.",
    profile: "full",
    schema: z.object({
      id: z.uuid(),
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(50000),
    }),
    method: "POST",
    path: (a) => `/conversations/${a.id}/messages`,
    body: (a) => ({ role: a.role, content: a.content }),
  }),
  apiTool({
    name: "clear_messages",
    description: "Limpa todas as mensagens de uma conversa.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/conversations/${a.id}/messages`,
  }),
];
