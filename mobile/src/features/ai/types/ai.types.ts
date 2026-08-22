import type { Ionicons } from '@expo/vector-icons'
import type { z } from 'zod'
import type {
  agentRequestSchema,
  chatTurnSchema,
  functionCallPartSchema,
  geminiResponseSchema,
  responsePartSchema,
  textPartSchema,
} from '@/features/ai/schemas/ai.schema'

/** Tipos derivados dos schemas zod — nunca declarar a forma duas vezes. */

export type ChatTurn = z.infer<typeof chatTurnSchema>
export type AgentRequest = z.infer<typeof agentRequestSchema>
export type TextPart = z.infer<typeof textPartSchema>
export type FunctionCallPart = z.infer<typeof functionCallPartSchema>
export type ResponsePart = z.infer<typeof responsePartSchema>
export type GeminiResponse = z.infer<typeof geminiResponseSchema>

/** Papeis aceitos pela API do Gemini (o assistente e' `model`, nao `assistant`). */
export type GeminiRole = 'user' | 'model'

/** Resultado de uma ferramenta, devolvido ao modelo. */
export interface FunctionResponsePart {
  functionResponse: {
    name: string
    response: Record<string, unknown>
  }
}

/**
 * Documento anexado inline (ex.: PDF de um arquivo de referencia). O Gemini
 * le o conteudo de verdade a partir daqui — o JSON da tool que o pediu so'
 * avisa que o anexo vem junto, nao carrega o texto do documento.
 */
export interface InlineDataPart {
  inlineData: { mimeType: string; data: string }
}

/** Um turno no formato da API: texto, chamada de ferramenta, resultado dela ou anexo. */
export interface GeminiContent {
  role: GeminiRole
  parts: (ResponsePart | FunctionResponsePart | InlineDataPart)[]
}

/**
 * Declaracao de ferramenta no subconjunto de OpenAPI aceito pelo Gemini.
 * Funcao sem argumento omite `parameters`.
 */
export interface FunctionDeclaration {
  name: string
  description: string
  parameters?: {
    type: 'OBJECT'
    properties: Record<string, unknown>
    required?: string[]
  }
}

/** Atalho exibido antes da primeira pergunta. */
export interface Suggestion {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  prompt: string
}
