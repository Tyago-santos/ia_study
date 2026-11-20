import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  BACKEND_URL: z.url(),
  DATABASE_URL: z.url(),
  MCP_ACCESS_TOKEN: z.string().min(32, "MCP_ACCESS_TOKEN deve ter ao menos 32 caracteres"),
  MCP_SESSION_SECRET: z.string().min(32, "MCP_SESSION_SECRET deve ter ao menos 32 caracteres"),
  MCP_PUBLIC_HOST: z.string().min(1).default("localhost"),
  MCP_TOOL_PROFILE: z.enum(["core", "full"]).default("full"),
  MCP_SESSION_TTL_HOURS: z.coerce.number().int().positive().default(12),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variáveis de ambiente inválidas no MCP:", parsed.error.issues);
  throw new Error(`Config inválida: ${parsed.error.issues[0]?.message}`);
}

export const env = parsed.data;
