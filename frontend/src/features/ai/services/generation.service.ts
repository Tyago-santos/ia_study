import type { ZodType } from 'zod'
import { api, ApiError, OfflineError } from '@/shared/services/api'
import {
  GENERATION_SYSTEM_PROMPT,
  buildGenerationPrompt,
  type GenerationInput,
} from '@/features/ai/lib/generation.prompt'
import {
  RESPONSE_SCHEMAS,
  flashcardsSchema,
  mindMapSchema,
  quizSchema,
  summarySchema,
  type GenerationKind,
} from '@/features/ai/schemas/generation.schema'
import { newNodeId } from '@/features/mindmaps/lib/generator'
import type { MindMapNode } from '@/shared/types'

/**
 * Gera material de estudo com a IA — mesma pipeline do app mobile
 * (`mobile/src/features/ai/services/generation.service.ts`): pede um JSON no
 * formato exigido via `/ai/generate-json` e confere com zod antes de devolver.
 *
 * Diferente do mobile, isso aqui NAO grava nada: so devolve o material gerado
 * e cada feature (flashcards/quiz/...) decide como persistir, reaproveitando
 * o service/hook real que ja tem.
 */

export class GenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GenerationError'
  }
}

/** Geracao passa longe dos 10s padrao do cliente HTTP — o Gemini demora mais que isso. */
const GENERATION_TIMEOUT_MS = 120_000

function toGenerationError(error: unknown): GenerationError {
  if (error instanceof ApiError) {
    const message =
      error.data && typeof error.data === 'object' && 'message' in error.data
        ? String((error.data as { message?: unknown }).message)
        : null
    return new GenerationError(message || `A IA respondeu com erro (HTTP ${error.status}).`)
  }
  if (error instanceof OfflineError) {
    return new GenerationError('Não foi possível falar com o servidor. Verifique sua conexão.')
  }
  if (error instanceof GenerationError) return error
  return new GenerationError('Erro inesperado ao falar com a IA.')
}

async function ask<T>(kind: GenerationKind, input: GenerationInput, schema: ZodType<T>): Promise<T> {
  let raw: unknown
  try {
    const response = await api.post<{ data: unknown }>(
      '/ai/generate-json',
      {
        systemInstruction: GENERATION_SYSTEM_PROMPT,
        prompt: buildGenerationPrompt(kind, input),
        responseSchema: RESPONSE_SCHEMAS[kind],
      },
      { timeoutMs: GENERATION_TIMEOUT_MS }
    )
    raw = response.data
  } catch (error) {
    throw toGenerationError(error)
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    console.error(`[generation:${kind}]`, parsed.error.issues)
    throw new GenerationError('O material veio fora do formato esperado. Tente de novo.')
  }

  return parsed.data
}

export interface GeneratedSummary {
  title: string
  content: string
}

export async function generateSummary(input: GenerationInput): Promise<GeneratedSummary> {
  const resumo = await ask('summary', input, summarySchema)
  return { title: resumo.titulo, content: resumo.conteudo }
}

export interface GeneratedMindMap {
  title: string
  nodes: MindMapNode[]
}

/**
 * O mapa e' escrito de cima para baixo: a raiz nasce junto com o mapa, e cada
 * ramo/folha so' entra depois que o pai ja existe (mesma ordem do mobile).
 */
export async function generateMindMap(input: GenerationInput): Promise<GeneratedMindMap> {
  const mapa = await ask('mindMap', input, mindMapSchema)

  const rootId = newNodeId()
  const nodes: MindMapNode[] = [{ id: rootId, parentId: null, label: mapa.titulo }]

  for (const ramo of mapa.ramos) {
    const branchId = newNodeId()
    nodes.push({ id: branchId, parentId: rootId, label: ramo.rotulo })
    for (const folha of ramo.subRamos) {
      nodes.push({ id: newNodeId(), parentId: branchId, label: folha })
    }
  }

  return { title: mapa.titulo, nodes }
}

export interface GeneratedFlashcard {
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export async function generateFlashcards(input: GenerationInput): Promise<GeneratedFlashcard[]> {
  const { flashcards } = await ask('flashcards', input, flashcardsSchema)
  return flashcards.map((card) => ({
    front: card.frente,
    back: card.verso,
    difficulty: card.dificuldade,
  }))
}

export interface GeneratedQuiz {
  title: string
  questions: { question: string; options: string[]; correctAnswer: number }[]
}

export async function generateQuiz(input: GenerationInput): Promise<GeneratedQuiz> {
  const quiz = await ask('quiz', input, quizSchema)
  return {
    title: quiz.titulo,
    questions: quiz.questoes.map((questao) => ({
      question: questao.pergunta,
      options: questao.alternativas,
      // O modelo pode apontar uma posicao que nao existe; o limite mantem a
      // questao respondivel em vez de deixar um quiz sem gabarito valido.
      correctAnswer: Math.min(questao.indiceCorreto, questao.alternativas.length - 1),
    })),
  }
}
