import { GeminiError, generateJson } from '@/features/ai/libs/gemini/gemini.client'
import {
  GENERATION_SYSTEM_PROMPT,
  type GenerationInput,
  buildGenerationPrompt,
} from '@/features/ai/libs/generation.prompt'
import {
  RESPONSE_SCHEMAS,
  flashcardsSchema,
  type GenerationKind,
  mindMapSchema,
  quizSchema,
  summarySchema,
} from '@/features/ai/schemas/generation.schema'
import { createId } from '@/shared/lib/id'
import {
  flashcardsService,
  mindMapsService,
  quizService,
  summariesService,
} from '@/shared/services/dataStore'
import type { QuizQuestion } from '@/shared/types'
import type { ZodType } from 'zod'

/**
 * Gera um artefato de estudo com a IA e grava no banco local.
 *
 * Um tipo por chamada: quem clicou no botao de Flashcards quer flashcards, e
 * gerar as outras tres coisas junto encheria as telas de material que ninguem
 * pediu. Cada gerador cuida do seu formato e devolve a frase do aviso final.
 */

/** Pede ao modelo e confere o que voltou, no formato daquele tipo. */
async function ask<T>(
  kind: GenerationKind,
  input: GenerationInput,
  schema: ZodType<T>,
): Promise<T> {
  const raw = await generateJson({
    systemInstruction: GENERATION_SYSTEM_PROMPT,
    prompt: buildGenerationPrompt(kind, input),
    responseSchema: RESPONSE_SCHEMAS[kind],
  })

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    console.error(`[generation:${kind}]`, parsed.error.issues)
    throw new GeminiError('O material veio fora do formato esperado. Tente de novo.')
  }

  return parsed.data
}

async function generateSummary(input: GenerationInput): Promise<string> {
  const resumo = await ask('summary', input, summarySchema)

  await summariesService.create({
    subjectId: input.subject.id,
    title: resumo.titulo,
    content: resumo.conteudo,
    sourceType: 'text',
  })

  return `Resumo "${resumo.titulo}" salvo.`
}

async function generateFlashcards(input: GenerationInput): Promise<string> {
  const { flashcards } = await ask('flashcards', input, flashcardsSchema)

  for (const card of flashcards) {
    await flashcardsService.create({
      subjectId: input.subject.id,
      front: card.frente,
      back: card.verso,
      difficulty: card.dificuldade,
    })
  }

  return `${flashcards.length} flashcards adicionados.`
}

/**
 * O mapa e' escrito de cima para baixo porque cada no so' pode ser criado
 * depois do seu pai — a raiz ja nasce junto com o mapa.
 */
async function generateMindMap(input: GenerationInput): Promise<string> {
  const mapa = await ask('mindMap', input, mindMapSchema)

  const created = await mindMapsService.create({
    subjectId: input.subject.id,
    title: mapa.titulo,
  })
  const rootId = created.nodes[0].id

  for (const ramo of mapa.ramos) {
    const branch = await mindMapsService.addNode({
      mapId: created.id,
      parentId: rootId,
      label: ramo.rotulo,
    })

    for (const folha of ramo.subRamos) {
      await mindMapsService.addNode({ mapId: created.id, parentId: branch.id, label: folha })
    }
  }

  const nodes = mapa.ramos.reduce((sum, ramo) => sum + 1 + ramo.subRamos.length, 1)
  return `Mapa "${mapa.titulo}" criado com ${nodes} nós.`
}

async function generateQuiz(input: GenerationInput): Promise<string> {
  const quiz = await ask('quiz', input, quizSchema)

  const questions: QuizQuestion[] = quiz.questoes.map((questao) => ({
    // O app casa a resposta com a pergunta pelo id, entao ele nasce aqui.
    id: createId('qq'),
    question: questao.pergunta,
    options: questao.alternativas,
    // O modelo pode apontar uma posicao que nao existe; o limite mantem a
    // questao respondivel em vez de deixar um quiz sem gabarito valido.
    correctAnswer: Math.min(questao.indiceCorreto, questao.alternativas.length - 1),
  }))

  await quizService.create({ subjectId: input.subject.id, title: quiz.titulo, questions })

  return `Quiz "${quiz.titulo}" criado com ${questions.length} questões.`
}

const GENERATORS: Record<GenerationKind, (input: GenerationInput) => Promise<string>> = {
  summary: generateSummary,
  flashcards: generateFlashcards,
  mindMap: generateMindMap,
  quiz: generateQuiz,
}

/** Gera, grava e devolve a frase que a tela mostra ao terminar. */
export function generateArtifact(kind: GenerationKind, input: GenerationInput): Promise<string> {
  return GENERATORS[kind](input)
}
