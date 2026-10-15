import { api } from '@/shared/services/api'
import { conversationsApi, toChatMessage, toConversation } from '@/shared/services/conversationsApi'
import type { ChatMessage } from '@/shared/types'

/**
 * Assistente de estudos do Gnosis IA, chamado direto pelo endpoint generico
 * do backend (`/ai/generate`, proxy fino do Gemini). Sem as ferramentas de
 * biblioteca que o app mobile usa (`list_subjects`/`list_topics` etc.) — aqui
 * e' uma conversa direta, sem checar o que o usuario tem cadastrado.
 */
const SYSTEM_INSTRUCTION =
  'Você é o assistente de estudos do Gnosis IA. Fale em português do Brasil, em tom direto e ' +
  'próximo, como um bom monitor de estudos. Ajude com dúvidas de conteúdo, resumos, planos de ' +
  'estudo e organização — seja objetivo e didático.'

interface GeminiPart {
  text?: string
  thought?: boolean
}

function extractText(parts: GeminiPart[]): string {
  const text = parts
    .filter((part) => typeof part.text === 'string' && !part.thought)
    .map((part) => part.text)
    .join('')
    .trim()

  return text || 'Não consegui montar uma resposta. Tente reformular a pergunta.'
}

async function askGemini(history: ChatMessage[], question: string): Promise<string> {
  const contents = [
    ...history
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: question }] },
  ]

  const { parts } = await api.post<{ parts: GeminiPart[] }>('/ai/generate', {
    contents,
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [],
    useWebSearch: false,
  })

  return extractText(parts)
}

export const aiService = {
  getConversations: async () => (await conversationsApi.list()).map(toConversation),

  getMessages: async (conversationId: string) =>
    (await conversationsApi.listMessages(conversationId)).map(toChatMessage),

  createConversation: async (title?: string) => toConversation(await conversationsApi.create(title)),

  renameConversation: (id: string, title: string) => conversationsApi.rename(id, title),

  deleteConversation: (id: string) => conversationsApi.remove(id),

  /** Esvazia a conversa mantendo-a na lista: apaga so' as mensagens. */
  clearMessages: async (id: string) => {
    await conversationsApi.clearMessages(id)
    return id
  },

  sendMessage: async (conversationId: string, data: { content: string }) => {
    const history = (await conversationsApi.listMessages(conversationId)).map(toChatMessage)

    await conversationsApi.addMessage(conversationId, { role: 'user', content: data.content })
    const answer = await askGemini(history, data.content)

    return toChatMessage(
      await conversationsApi.addMessage(conversationId, { role: 'assistant', content: answer }),
    )
  },
}
