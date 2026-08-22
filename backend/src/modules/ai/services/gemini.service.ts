import { env } from "@/config/env.js";
import { AppError } from "@/shared/error/app-error.js";

/**
 * Unico ponto do backend que fala com o Gemini. A chave fica so' aqui — o
 * app manda contents/tools/prompt prontos e recebe as partes cruas de volta,
 * sem nunca ver a chave (era embutida no bundle antes, ver mobile/gemini.client.ts).
 */

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

const CHAT_TIMEOUT_MS = 30_000;
const GENERATION_TIMEOUT_MS = 120_000;

function getApiKeys(): string[] {
  return env.GEMINI_API_KEY.split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

export function isConfigured(): boolean {
  return getApiKeys().length > 0;
}

let activeKeyIndex = 0;

const KEY_ROTATION_STATUSES = new Set([403, 429, 500, 502, 503]);
const MAX_RATE_LIMIT_RETRIES = 4;
const DEFAULT_RATE_LIMIT_DELAY_MS = 3_000;
const MAX_RATE_LIMIT_DELAY_MS = 15_000;

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/** Combina o timeout da chamada com o cancelamento vindo do cliente (`req.on('close')`). */
function mergeSignals(a: AbortSignal, b?: AbortSignal): AbortSignal {
  if (!b) return a;

  const controller = new AbortController();
  const abort = () => controller.abort();
  a.addEventListener("abort", abort);
  b.addEventListener("abort", abort);
  return controller.signal;
}

function rateLimitDelayMs(response: Response): number {
  const seconds = Number(response.headers.get("retry-after"));
  const ms = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : DEFAULT_RATE_LIMIT_DELAY_MS;
  return Math.min(ms, MAX_RATE_LIMIT_DELAY_MS);
}

function statusToAppError(status: number): AppError {
  if (status === 429) {
    return new AppError("A cota de tokens da IA acabou por hoje. Tente novamente mais tarde ou troque de chave.", 429);
  }
  if (status === 403) {
    return new AppError("Uma das chaves da IA foi recusada. Verifique se ela esta ativa.", 502);
  }
  if (status >= 500) {
    return new AppError("O servidor da IA esta muito ocupado agora. Tente novamente em instantes.", 503);
  }
  return new AppError(`O Gemini respondeu com erro (HTTP ${status}).`, 502);
}

async function callGemini(body: object, timeoutMs: number, signal?: AbortSignal): Promise<unknown[]> {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new AppError("GEMINI_API_KEY nao configurada no servidor.", 503);
  }

  const url = `${ENDPOINT}/${env.GEMINI_MODEL}:generateContent`;

  for (let round = 0; round <= MAX_RATE_LIMIT_RETRIES; round++) {
    if (signal?.aborted) throw new AppError("Pedido cancelado.", 499);

    let lastError: AppError | null = null;
    let rateLimitDelay: number | null = null;

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const index = (activeKeyIndex + attempt) % keys.length;
      const apiKey = keys[index]!;

      let response: Response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify(body),
          signal: mergeSignals(AbortSignal.timeout(timeoutMs), signal),
        });
      } catch {
        if (signal?.aborted) throw new AppError("Pedido cancelado.", 499);
        throw new AppError("Nao foi possivel falar com o Gemini.", 503);
      }

      if (!response.ok) {
        console.error("[gemini]", response.status, await response.text().catch(() => ""));

        lastError = statusToAppError(response.status);
        if (!KEY_ROTATION_STATUSES.has(response.status)) throw lastError;

        rateLimitDelay = response.status === 429 ? rateLimitDelayMs(response) : null;
        continue;
      }

      activeKeyIndex = index;

      const data = (await response.json().catch(() => null)) as
        | { candidates?: { content?: { parts?: unknown[] } }[]; promptFeedback?: { blockReason?: string } }
        | null;

      if (!data) throw new AppError("Resposta inesperada do Gemini.", 502);
      if (data.promptFeedback?.blockReason) {
        throw new AppError("O pedido foi bloqueado pelos filtros de seguranca do Gemini.", 400);
      }

      return data.candidates?.[0]?.content?.parts ?? [];
    }

    if (rateLimitDelay === null || round === MAX_RATE_LIMIT_RETRIES) {
      throw lastError ?? new AppError("O Gemini respondeu com erro.", 502);
    }

    await sleep(rateLimitDelay, signal);
  }

  throw new AppError("O Gemini respondeu com erro.", 502);
}

export interface GenerateContentInput {
  contents: unknown[];
  systemInstruction: string;
  tools: unknown[];
  useWebSearch?: boolean;
  signal?: AbortSignal;
}

export async function generateContent(input: GenerateContentInput): Promise<unknown[]> {
  const tools = input.useWebSearch ? [{ googleSearch: {} }] : [{ functionDeclarations: input.tools }];

  return callGemini(
    {
      systemInstruction: { parts: [{ text: input.systemInstruction }] },
      contents: input.contents,
      tools,
      generationConfig: { temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } },
    },
    CHAT_TIMEOUT_MS,
    input.signal,
  );
}

export interface GenerateJsonInput {
  systemInstruction: string;
  prompt: string;
  responseSchema: object;
}

export async function generateJson(input: GenerateJsonInput): Promise<unknown> {
  const parts = await callGemini(
    {
      systemInstruction: { parts: [{ text: input.systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: input.prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: input.responseSchema,
      },
    },
    GENERATION_TIMEOUT_MS,
  );

  const text = parts
    .map((part) => (part && typeof part === "object" && "text" in part && typeof (part as { text: unknown }).text === "string" ? (part as { text: string }).text : ""))
    .join("")
    .trim();

  if (!text) throw new AppError("O Gemini devolveu uma resposta vazia.", 502);

  try {
    return JSON.parse(text);
  } catch {
    throw new AppError("O Gemini devolveu um JSON invalido.", 502);
  }
}

const TRANSCRIBE_PROMPT =
  "Transcreva literalmente o que a pessoa esta falando neste audio, em portugues. " +
  "Devolva apenas o texto transcrito, sem comentarios, aspas ou formatacao extra.";

export interface TranscribeAudioInput {
  mimeType: string;
  base64: string;
}

export async function transcribeAudio(input: TranscribeAudioInput): Promise<string> {
  const parts = await callGemini(
    {
      contents: [
        {
          role: "user",
          parts: [
            { text: TRANSCRIBE_PROMPT },
            { inlineData: { mimeType: input.mimeType, data: input.base64 } },
          ],
        },
      ],
      generationConfig: { temperature: 0 },
    },
    CHAT_TIMEOUT_MS,
  );

  const text = parts
    .map((part) => (part && typeof part === "object" && "text" in part && typeof (part as { text: unknown }).text === "string" ? (part as { text: string }).text : ""))
    .join("")
    .trim();

  if (!text) throw new AppError("Nao consegui entender o audio. Tente novamente.", 502);
  return text;
}
