import { z } from "zod";

import { env } from "../config/env.js";
import type { ToolDefinition } from "./types.js";

export const sessionTools: ToolDefinition<any>[] = [
  {
    name: "login",
    title: "Login no StudyHub",
    description:
      "Autentica o usuário no StudyHub AI com email e senha. Persiste a sessão cifrada no banco do MCP, chaveada pelo token do endpoint. Necessário antes de chamar qualquer outra tool.",
    schema: z.object({ email: z.email(), password: z.string().min(6) }),
    profile: "core",
    annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: true },
    handler: async (args, ctx) => {
      const result = await ctx.backend.login(args.email, args.password);
      const session = {
        clientId: ctx.clientId,
        userId: result.user.id,
        email: result.user.email,
        token: result.token,
        password: args.password,
        expiresAt: new Date(Date.now() + env.MCP_SESSION_TTL_HOURS * 60 * 60 * 1000),
      };
      await ctx.store.save(session);
      ctx.session = session;
      return { user: result.user, expiresAt: session.expiresAt.toISOString() };
    },
  },
  {
    name: "logout",
    title: "Logout",
    description: "Encerra a sessão atual do usuário no MCP (apaga do banco).",
    schema: z.object({}),
    profile: "core",
    annotations: { destructiveHint: true, idempotentHint: true },
    handler: async (_args, ctx) => {
      await ctx.store.delete(ctx.clientId);
      ctx.session = null;
      return { ok: true };
    },
  },
  {
    name: "session_status",
    title: "Status da sessão",
    description: "Retorna se há usuário logado e os dados básicos da sessão.",
    schema: z.object({}),
    profile: "core",
    annotations: { readOnlyHint: true },
    handler: async (_args, ctx) => {
      const session = await ctx.store.get(ctx.clientId);
      ctx.session = session;
      if (!session) return { authenticated: false };
      return {
        authenticated: true,
        userId: session.userId,
        email: session.email,
        expiresAt: session.expiresAt.toISOString(),
      };
    },
  },
];
