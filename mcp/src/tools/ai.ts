import { z } from "zod";

import { apiTool } from "./_factory.js";

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

const MAX_INLINE_BASE64_CHARS = 12 * 1024 * 1024;

export const aiTools = [
  apiTool({ name: "ai_status", description: "Status do serviço de IA (Gemini).", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/ai/status" }),
  apiTool({
    name: "ai_generate",
    description:
      "Proxy fino do Gemini: envia contents/systemInstruction/tools e retorna a resposta. O chamador fornece o prompt completo.",
    profile: "full",
    schema: z.object({
      contents: z.array(geminiContentSchema).min(1),
      systemInstruction: z.string(),
      tools: z.array(functionDeclarationSchema).default([]),
      useWebSearch: z.boolean().default(false),
    }),
    method: "POST",
    path: () => "/ai/generate",
    body: (a) => a,
  }),
  apiTool({
    name: "ai_generate_json",
    description: "Gera uma resposta JSON estruturada via Gemini.",
    profile: "full",
    schema: z.object({
      systemInstruction: z.string(),
      prompt: z.string().min(1),
      responseSchema: z.record(z.string(), z.unknown()),
    }),
    method: "POST",
    path: () => "/ai/generate-json",
    body: (a) => a,
  }),
  apiTool({
    name: "ai_transcribe",
    description: "Transcreve áudio (base64) via Gemini.",
    profile: "full",
    schema: z.object({
      mimeType: z.string().min(1),
      base64: z.string().min(1).max(MAX_INLINE_BASE64_CHARS),
    }),
    method: "POST",
    path: () => "/ai/transcribe",
    body: (a) => a,
  }),
  apiTool({
    name: "ai_extract_pdf",
    description: "Extrai texto de um PDF (base64).",
    profile: "full",
    schema: z.object({ base64: z.string().min(1).max(MAX_INLINE_BASE64_CHARS) }),
    method: "POST",
    path: () => "/ai/extract-pdf",
    body: (a) => a,
  }),
];
