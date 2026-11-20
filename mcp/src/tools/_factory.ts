import { z } from "zod";

import { env } from "../config/env.js";
import { BackendClient, BackendError, type BackendRequestOpts } from "../lib/backend-client.js";
import type { ToolContext } from "./types.js";
import type { ToolDefinition } from "./types.js";

export async function requireSession(ctx: ToolContext) {
  if (!ctx.session) {
    const stored = await ctx.store.get(ctx.clientId);
    ctx.session = stored;
  }
  if (!ctx.session) {
    throw new Error("Não autenticado. Use a tool 'login' antes de chamar esta ferramenta.");
  }
  return ctx.session;
}

export async function withBackend<T>(
  ctx: ToolContext,
  fn: (token: string) => Promise<T>,
): Promise<T> {
  const session = await requireSession(ctx);
  try {
    return await fn(session.token);
  } catch (err) {
    if (err instanceof BackendError && err.status === 401) {
      const result = await ctx.backend.login(session.email, session.password);
      const updated = {
        ...session,
        token: result.token,
        expiresAt: new Date(Date.now() + env.MCP_SESSION_TTL_HOURS * 60 * 60 * 1000),
      };
      await ctx.store.save(updated);
      ctx.session = updated;
      return fn(result.token);
    }
    throw err;
  }
}

export interface ApiToolSpec<S extends z.ZodTypeAny> {
  name: string;
  title?: string;
  description: string;
  profile: "core" | "full";
  schema: S;
  annotations?: ToolDefinition<S>["annotations"];
  method: BackendRequestOpts["method"];
  path: (args: z.infer<S>) => string;
  body?: (args: z.infer<S>) => unknown;
  query?: (args: z.infer<S>) => Record<string, string | number | boolean | undefined>;
}

export function apiTool<S extends z.ZodTypeAny>(spec: ApiToolSpec<S>): ToolDefinition<S> {
  return {
    name: spec.name,
    title: spec.title,
    description: spec.description,
    schema: spec.schema,
    profile: spec.profile,
    annotations: spec.annotations,
    handler: async (args, ctx) => {
      return withBackend(ctx, (token) =>
        ctx.backend.request(
          {
            method: spec.method,
            path: spec.path(args),
            body: spec.body ? spec.body(args) : undefined,
            query: spec.query ? spec.query(args) : undefined,
          },
          token,
        ),
      );
    },
  };
}
