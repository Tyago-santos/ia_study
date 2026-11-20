import type { McpServer } from "@modelcontextprotocol/server";
import type { z } from "zod";

import { ok, toolError } from "../lib/tool-result.js";

import type { SessionStore, StoredSession } from "../lib/session-store.js";
import { BackendClient } from "../lib/backend-client.js";

export interface ToolContext {
  clientId: string;
  store: SessionStore;
  backend: BackendClient;
  /** Sessão atual (login feito) ou null. */
  session: StoredSession | null;
}

export interface ToolDefinition<S extends z.ZodTypeAny = z.ZodTypeAny> {
  name: string;
  title?: string;
  description: string;
  schema: S;
  profile: "core" | "full";
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  handler: (args: z.infer<S>, ctx: ToolContext) => Promise<unknown>;
}

export type AnyToolDefinition = ToolDefinition<any>;

export function registerTools(
  server: McpServer,
  tools: AnyToolDefinition[],
  ctx: ToolContext,
  profile: string,
) {
  for (const tool of tools) {
    if (profile === "core" && tool.profile !== "core") continue;
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.schema as any,
        annotations: tool.annotations,
      },
      async (args: any) => {
        try {
          const data = await tool.handler(args, ctx);
          return ok(data);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return toolError(message);
        }
      },
    );
  }
}
