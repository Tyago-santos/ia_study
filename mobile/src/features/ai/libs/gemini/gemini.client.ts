import { ApiError, OfflineError, api } from '@/shared/services/api'
import type {
  FunctionDeclaration,
  GeminiContent,
  ResponsePart,
} from '@/features/ai/types/ai.types'

/**
 * Unico ponto do app que fala com a IA. Trocar de provedor de LLM vira
 * trocar esta pasta.
 *
 * A chave do Gemini nao mora mais aqui: as chamadas vao para `/ai/*` no
 * backend, que guarda a chave, faz a rotacao entre varias e devolve so' o
 * resultado. O app nunca ve a chave.
 */

/** Conversa: uma resposta curta por vez, com o usuario esperando na tela. */
const CHAT_TIMEOUT_MS = 30_000

/**
 * Geracao de material: o modelo escreve resumo, flashcards, mapa e quiz numa
 * tacada. Medido contra a API, isso passa de trinta segundos com folga — o
 * prazo do chat cortaria a resposta no meio.
 */
const GENERATION_TIMEOUT_MS = 120_000

export class GeminiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeminiError'
  }
}

/** Lançado quando quem chamou aborta o `signal` — o usuário cancelou, não é falha de rede. */
export class GeminiCancelledError extends GeminiError {
  constructor(message = 'Pergunta cancelada.') {
    super(message)
    this.name = 'GeminiCancelledError'
  }
}

/** Sempre checa o cancelamento primeiro: um abort no meio de uma falha de rede não é a falha de rede. */
function toGeminiError(error: unknown, signal?: AbortSignal): GeminiError {
  if (signal?.aborted) return new GeminiCancelledError()

  if (error instanceof ApiError) {
    const message =
      error.data && typeof error.data === 'object' && 'message' in error.data
        ? String((error.data as { message?: unknown }).message)
        : null
    return new GeminiError(message || `A IA respondeu com erro (HTTP ${error.status}).`)
  }

  if (error instanceof OfflineError) {
    return new GeminiError('Não foi possível falar com o servidor. Verifique sua conexão.')
  }

  if (error instanceof GeminiError) return error

  return new GeminiError('Erro inesperado ao falar com a IA.')
}

/** As telas usam isto pra avisar antes do usuario perguntar, em vez de so' falhar na hora. */
export async function isGeminiConfigured(): Promise<boolean> {
  try {
    const { configured } = await api.get<{ configured: boolean }>('/ai/status')
    return configured
  } catch {
    return true // Falha de rede aqui nao significa "IA nao configurada": deixa a pergunta seguir e falhar com o erro certo la'.
  }
}

export interface GenerateContentInput {
  contents: GeminiContent[]
  systemInstruction: string
  tools: FunctionDeclaration[]
  /**
   * Troca as tools locais pelo grounding nativo do Gemini (`googleSearch`): o
   * proprio provedor pesquisa na web e cita as fontes na resposta. A API nao
   * aceita misturar esta tool com `functionDeclarations` no mesmo pedido, entao
   * quando ligado as tools locais (biblioteca, progresso) ficam de fora desta
   * rodada.
   */
  useWebSearch?: boolean
  /** Aborta a chamada quando o usuario cancela a pergunta. */
  signal?: AbortSignal
}

/** Uma rodada de conversa com ferramentas. Devolve as partes cruas do candidato. */
export async function generateContent(input: GenerateContentInput): Promise<ResponsePart[]> {
  try {
    const { parts } = await api.post<{ parts: ResponsePart[] }>(
      '/ai/generate',
      {
        contents: input.contents,
        systemInstruction: input.systemInstruction,
        tools: input.tools,
        useWebSearch: input.useWebSearch ?? false,
      },
      { signal: input.signal, timeoutMs: CHAT_TIMEOUT_MS },
    )
    return parts
  } catch (error) {
    throw toGeminiError(error, input.signal)
  }
}

export interface GenerateJsonInput {
  systemInstruction: string
  prompt: string
  /** Formato exigido da resposta, no subconjunto de OpenAPI aceito pelo Gemini. */
  responseSchema: object
}

/**
 * Pede uma resposta em JSON com formato garantido pelo proprio provedor.
 *
 * O retorno e' `unknown`: quem chama valida com zod, porque o schema garante
 * a forma e nao o conteudo.
 */
export async function generateJson(input: GenerateJsonInput): Promise<unknown> {
  try {
    const { data } = await api.post<{ data: unknown }>('/ai/generate-json', input, {
      timeoutMs: GENERATION_TIMEOUT_MS,
    })
    return data
  } catch (error) {
    throw toGeminiError(error)
  }
}

export interface TranscribeAudioInput {
  mimeType: string
  base64: string
  signal?: AbortSignal
}

/**
 * Manda o audio gravado pro backend transcrever (o mesmo mecanismo de anexo
 * inline usado para imagem, so' que a chamada ao provedor acontece la'). O
 * resultado entra no compose exatamente como se o usuario tivesse digitado.
 */
export async function transcribeAudio(input: TranscribeAudioInput): Promise<string> {
  try {
    const { text } = await api.post<{ text: string }>(
      '/ai/transcribe',
      { mimeType: input.mimeType, base64: input.base64 },
      { signal: input.signal, timeoutMs: CHAT_TIMEOUT_MS },
    )
    if (!text) throw new GeminiError('Não consegui entender o áudio. Tente novamente.')
    return text
  } catch (error) {
    throw toGeminiError(error, input.signal)
  }
}

export interface ExtractPdfTextInput {
  base64: string
  signal?: AbortSignal
}

/**
 * Manda um PDF pro backend extrair o texto (em vez do app anexar o arquivo
 * binario inteiro na conversa). O arquivo de referencia passa a se comportar
 * como um .txt/.md: o texto extraido e' o que a tool `read_reference_file`
 * devolve ao modelo (ver `reference-files.service.ts`).
 */
export async function extractPdfText(input: ExtractPdfTextInput): Promise<string> {
  try {
    const { text } = await api.post<{ text: string }>(
      '/ai/extract-pdf',
      { base64: input.base64 },
      { signal: input.signal, timeoutMs: GENERATION_TIMEOUT_MS },
    )
    return text
  } catch (error) {
    throw toGeminiError(error, input.signal)
  }
}
