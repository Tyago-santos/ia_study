import { mockSummaries } from '@/shared/mocks/data'
import { delay, nextId } from '@/shared/mocks/helpers'
import type { Summary } from '@/shared/types'

const summaries = [...mockSummaries]

export const summariesService = {
  getAll: async (params?: { subjectId?: string }) => {
    let filtered = summaries
    if (params?.subjectId) {
      filtered = filtered.filter((r) => r.subjectId === params.subjectId)
    }
    return delay([...filtered])
  },

  create: async (data: {
    subjectId: string
    title: string
    content: string
    sourceType: Summary['sourceType']
  }) => {
    const summary: Summary = {
      id: nextId('r'),
      ...data,
      createdAt: new Date().toISOString(),
    }
    summaries.push(summary)
    return delay({ ...summary })
  },

  generateWithAI: async (data: { content: string; sourceType: string }) => {
    return delay({
      summary: `Resumo gerado por IA a partir do conteudo fornecido. Conteudo original: ${data.content.substring(0, 100)}...`,
    })
  },

  generateFlashcards: async (_summaryId: string) => {
    return delay({
      flashcards: [
        { front: 'Pergunta gerada 1?', back: 'Resposta gerada 1' },
        { front: 'Pergunta gerada 2?', back: 'Resposta gerada 2' },
      ],
    })
  },
}
