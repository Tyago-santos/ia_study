import { generateContent } from '@/features/ai/libs/gemini/gemini.client'
import {
  AGENT_TOOLS,
  executeTool,
  getReferenceFileAttachment,
} from '@/features/ai/services/agent-tools.service'
import {
  APP_KNOWLEDGE,
  SYSTEM_PROMPT,
  getDateContext,
} from '@/features/ai/services/study-context'
import { agentRequestSchema } from '@/features/ai/schemas/ai.schema'
import type {
  AgentRequest,
  FunctionCallPart,
  FunctionResponsePart,
  GeminiContent,
  InlineDataPart,
  ResponsePart,
  TextPart,
} from '@/features/ai/types/ai.types'

/**
 * Orquestra uma rodada do agente: monta o contexto, chama o Gemini, roda as
 * ferramentas que ele pedir e devolve o texto final.
 *
 * Sem estado: o historico chega inteiro a cada chamada, entao a conversa pode
 * ser reconstruida do banco local depois de fechar o app.
 */

const MAX_TOOL_ROUNDS = 4
const FALLBACK = 'Nao consegui montar uma resposta. Tente reformular a pergunta.'

/** Junta prompt de sistema, conhecimento do app e data numa instrucao so'. */
function buildSystemInstruction(): string {
  return [SYSTEM_PROMPT, getDateContext(), APP_KNOWLEDGE].join('\n\n')
}

/** Converte o historico da UI mais a pergunta atual para o formato do Gemini. */
function buildContents(input: AgentRequest): GeminiContent[] {
  const contents: GeminiContent[] = input.history.map((turn) => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
  }))

  contents.push({ role: 'user', parts: [{ text: input.message }] })
  return contents
}

function isFunctionCall(part: ResponsePart): part is FunctionCallPart {
  return 'functionCall' in part
}

function isText(part: ResponsePart): part is TextPart {
  return 'text' in part && typeof (part as TextPart).text === 'string'
}

/** O 2.5 pode marcar uma parte como raciocinio interno (`thought: true`); nunca e' a resposta pro usuario. */
function isThought(part: ResponsePart): boolean {
  return 'thought' in part && (part as { thought?: unknown }).thought === true
}

/** Extrai so' o texto visivel das partes devolvidas, com a mensagem padrao se vier vazio. */
function extractText(parts: ResponsePart[]): string {
  const text = parts
    .filter((part) => isText(part) && !isThought(part))
    .map((part) => (part as TextPart).text)
    .join('')
    .trim()

  return text || FALLBACK
}

export async function runAgent(input: AgentRequest, signal?: AbortSignal): Promise<string> {
  const request = agentRequestSchema.parse(input)
  const systemInstruction = buildSystemInstruction()
  const contents = buildContents(request)

  // Busca na web e tools locais nao se combinam num mesmo pedido (ver
  // `useWebSearch` em gemini.client.ts): quando ligada, e' so' uma rodada.
  if (request.webSearch) {
    const parts = await generateContent({
      contents,
      systemInstruction,
      tools: [],
      useWebSearch: true,
      signal,
    })
    return extractText(parts)
  }

  let parts = await generateContent({ contents, systemInstruction, tools: AGENT_TOOLS, signal })

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const calls = parts.filter(isFunctionCall)
    if (calls.length === 0) break

    // As partes do modelo voltam intactas (inclusive as internas do 2.5): e' o
    // que amarra cada resultado a chamada que o pediu.
    contents.push({ role: 'model', parts })

    const results: FunctionResponsePart[] = await Promise.all(
      calls.map(async (call) => ({
        functionResponse: {
          name: call.functionCall.name,
          response: await executeTool(call.functionCall.name, call.functionCall.args ?? {}),
        },
      })),
    )

    // Imagem pedida nesta rodada entra como anexo de verdade (o Gemini le' o
    // arquivo), nao so' o aviso em texto que a tool devolveu acima. PDF nao
    // passa por aqui: o texto ja' extraido volta dentro do proprio resultado
    // da tool (ver `readReferenceFile` em agent-tools.service.ts).
    const attachments: InlineDataPart[] = []
    for (const call of calls) {
      if (call.functionCall.name !== 'read_reference_file') continue
      const fileId = call.functionCall.args?.fileId
      if (typeof fileId !== 'string') continue

      const attachment = await getReferenceFileAttachment(fileId)
      if (attachment) attachments.push({ inlineData: attachment })
    }

    contents.push({ role: 'user', parts: [...results, ...attachments] })
    parts = await generateContent({ contents, systemInstruction, tools: AGENT_TOOLS, signal })
  }

  return extractText(parts)
}
