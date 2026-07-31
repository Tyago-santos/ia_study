import { z } from "zod";

const envcSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  DATABASE_URL: z.url(),
});

const _env = envcSchema.safeParse(process.env);

if (!_env.success) {
  console.error("variaveis de ambiente inválida");
  throw new Error(`ERRO na variável ${_env.error.issues[0]?.message}`);
}

export const env = _env.data;
