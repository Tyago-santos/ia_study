import { z } from "zod";

/**
 * O backend e' um proxy fino do Gemini: valida a forma da requisicao mas nao
 * conhece o conteudo (prompt de sistema, tools, historico) — isso continua no
 * app. `passthrough`/`unknown` preservam campos que o app precisa reenviar
 * intactos na rodada seguinte (ex.: partes de raciocinio do 2.5).
 */

const responsePartSchema = z.record(z.string(), z.unknown());

const functionDeclarationSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.string(), z.unknown()).optional(),
});

const geminiContentSchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z.array(responsePartSchema),
});

export const generateSchema = z.object({
  contents: z.array(geminiContentSchema).min(1),
  systemInstruction: z.string(),
  tools: z.array(functionDeclarationSchema).default([]),
  useWebSearch: z.boolean().default(false),
});

export type TypeGenerateSchema = z.infer<typeof generateSchema>;

export const generateJsonSchema = z.object({
  systemInstruction: z.string(),
  prompt: z.string().min(1),
  responseSchema: z.record(z.string(), z.unknown()),
});

export type TypeGenerateJsonSchema = z.infer<typeof generateJsonSchema>;

const MAX_INLINE_BASE64_CHARS = 12 * 1024 * 1024;

export const transcribeSchema = z.object({
  mimeType: z.string().min(1),
  base64: z.string().min(1).max(MAX_INLINE_BASE64_CHARS),
});

export type TypeTranscribeSchema = z.infer<typeof transcribeSchema>;

export const extractPdfSchema = z.object({
  base64: z.string().min(1).max(MAX_INLINE_BASE64_CHARS),
});

export type TypeExtractPdfSchema = z.infer<typeof extractPdfSchema>;
