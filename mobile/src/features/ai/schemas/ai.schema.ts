import { z } from 'zod'

/**
 * Schemas da feature de IA.
 *
 * A resposta do Gemini e' validada aqui, na fronteira: se o formato do provedor
 * mudar, quebra num ponto so' e nao dentro de um componente de tela.
 */

/** Um turno do historico. So' o texto importa para o contexto do modelo. */
export const chatTurnSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

/** Quantos turnos anteriores viajam junto com a pergunta. */
export const MAX_HISTORY_TURNS = 20

/** Entrada de uma rodada do agente. */
export const agentRequestSchema = z.object({
  message: z.string().trim().min(1, 'Mensagem vazia.'),
  history: z.array(chatTurnSchema).max(MAX_HISTORY_TURNS).default([]),
  /** Quando true, a pergunta e' respondida com busca no Google em vez das tools locais. */
  webSearch: z.boolean().default(false),
})

/**
 * Bloco de texto devolvido pelo modelo.
 *
 * O `passthrough` preserva campos que o provedor acrescente (o Gemini 2.5 anexa
 * a assinatura do raciocinio a parte): as partes do modelo sao reenviadas na
 * rodada seguinte e chegariam mutiladas se o zod as descartasse.
 */
export const textPartSchema = z.object({ text: z.string() }).passthrough()

/** Pedido do modelo para rodar uma ferramenta. */
export const functionCallPartSchema = z
  .object({
    functionCall: z.object({
      name: z.string(),
      args: z.record(z.unknown()).optional(),
    }),
  })
  .passthrough()

/** Uma parte da resposta. Tipos ainda desconhecidos caem no objeto aberto. */
export const responsePartSchema = z.union([
  textPartSchema,
  functionCallPartSchema,
  z.object({}).passthrough(),
])

/** Corpo devolvido por `models/{model}:generateContent`. */
export const geminiResponseSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({ parts: z.array(responsePartSchema).default([]) }).optional(),
        finishReason: z.string().optional(),
      }),
    )
    .default([]),
  promptFeedback: z.object({ blockReason: z.string().optional() }).optional(),
})
