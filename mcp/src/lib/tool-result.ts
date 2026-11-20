import type { CallToolResult } from "@modelcontextprotocol/server";

/** Envelope padrão: serializa o resultado como JSON no campo `text`. */
export function ok(data: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    structuredContent: data as Record<string, unknown>,
  };
}

export function toolError(message: string): CallToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}
