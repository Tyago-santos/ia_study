import { z } from "zod";

const envcSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  DATABASE_URL: z.url(),
  /** Migrações/CLI usam esta se vier definida (conexão direta/sessão) —
   * pooler em modo transação (pgbouncer) não suporta os locks do Migrate. */
  DIRECT_URL: z.url().optional(),
  /** Uma ou mais chaves separadas por vírgula — ver GeminiService para a rotação. */
  GEMINI_API_KEY: z.string().default(""),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  /** Origem do app web (CORS + cookie de sessão precisam saber quem pode mandar credenciais). */
  FRONTEND_URL: z.string().default("http://localhost:5173"),
});

const _env = envcSchema.safeParse(process.env);

if (!_env.success) {
  console.error("variaveis de ambiente inválida");
  throw new Error(`ERRO na variável ${_env.error.issues[0]?.message}`);
}

export const env = _env.data;
