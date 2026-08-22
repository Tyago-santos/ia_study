import { z } from 'zod'

/**
 * O que a IA pode gerar, um artefato por vez.
 *
 * Cada tipo aparece duas vezes de proposito, porque sao contratos diferentes:
 * `RESPONSE_SCHEMAS` e o formato EXIGIDO do modelo (o Gemini so' consegue emitir
 * tokens que caibam nele) e os schemas zod sao a CONFERENCIA do que chegou. O
 * primeiro garante a forma; o segundo protege o banco local antes de virar
 * registro gravado.
 *
 * Os campos estao em portugues porque e' o texto que o modelo escreve — pedir
 * "frente"/"verso" rende conteudo melhor do que "front"/"back" num pedido feito
 * em portugues. A traducao para os tipos do app acontece ao gravar.
 */

export type GenerationKind = 'summary' | 'flashcards' | 'mindMap' | 'quiz'

/** Quantidades pedidas ao modelo. Mexer aqui muda os dois contratos juntos. */
export const GENERATION_SIZES = {
  flashcards: { min: 6, max: 10 },
  branches: { min: 3, max: 5 },
  leaves: { min: 2, max: 4 },
  questions: { min: 4, max: 6 },
  options: 4,
} as const

/* --------------------------------- Resumo -------------------------------- */

export const summarySchema = z.object({
  titulo: z.string().min(1),
  conteudo: z.string().min(1),
})

const summaryResponse = {
  type: 'OBJECT',
  properties: {
    titulo: { type: 'STRING', description: 'Titulo curto do resumo.' },
    conteudo: {
      type: 'STRING',
      description:
        'Resumo em markdown: abertura de um paragrafo, secoes com "## " e listas com "- ". Entre 250 e 500 palavras.',
    },
  },
  required: ['titulo', 'conteudo'],
}

/* ------------------------------- Flashcards ------------------------------ */

export const flashcardsSchema = z.object({
  flashcards: z
    .array(
      z.object({
        frente: z.string().min(1),
        verso: z.string().min(1),
        dificuldade: z.enum(['easy', 'medium', 'hard']),
      }),
    )
    .min(1),
})

const flashcardsResponse = {
  type: 'OBJECT',
  properties: {
    flashcards: {
      type: 'ARRAY',
      minItems: GENERATION_SIZES.flashcards.min,
      maxItems: GENERATION_SIZES.flashcards.max,
      items: {
        type: 'OBJECT',
        properties: {
          frente: { type: 'STRING', description: 'A pergunta do cartao.' },
          verso: { type: 'STRING', description: 'A resposta, em ate duas frases.' },
          dificuldade: { type: 'STRING', enum: ['easy', 'medium', 'hard'] },
        },
        required: ['frente', 'verso', 'dificuldade'],
      },
    },
  },
  required: ['flashcards'],
}

/* ------------------------------ Mapa mental ------------------------------ */

export const mindMapSchema = z.object({
  titulo: z.string().min(1),
  ramos: z
    .array(
      z.object({
        rotulo: z.string().min(1),
        subRamos: z.array(z.string().min(1)),
      }),
    )
    .min(1),
})

const mindMapResponse = {
  type: 'OBJECT',
  properties: {
    titulo: { type: 'STRING', description: 'O no raiz do mapa.' },
    ramos: {
      type: 'ARRAY',
      minItems: GENERATION_SIZES.branches.min,
      maxItems: GENERATION_SIZES.branches.max,
      items: {
        type: 'OBJECT',
        properties: {
          rotulo: { type: 'STRING', description: 'Nome do ramo, em ate 4 palavras.' },
          subRamos: {
            type: 'ARRAY',
            minItems: GENERATION_SIZES.leaves.min,
            maxItems: GENERATION_SIZES.leaves.max,
            items: { type: 'STRING' },
          },
        },
        required: ['rotulo', 'subRamos'],
      },
    },
  },
  required: ['titulo', 'ramos'],
}

/* ---------------------------------- Quiz --------------------------------- */

export const quizSchema = z.object({
  titulo: z.string().min(1),
  questoes: z
    .array(
      z.object({
        pergunta: z.string().min(1),
        // Duas alternativas ja formam uma questao respondivel: exigir as quatro
        // aqui jogaria fora o quiz inteiro por uma questao mal formada.
        alternativas: z.array(z.string().min(1)).min(2),
        indiceCorreto: z.number().int().nonnegative(),
      }),
    )
    .min(1),
})

const quizResponse = {
  type: 'OBJECT',
  properties: {
    titulo: { type: 'STRING' },
    questoes: {
      type: 'ARRAY',
      minItems: GENERATION_SIZES.questions.min,
      maxItems: GENERATION_SIZES.questions.max,
      items: {
        type: 'OBJECT',
        properties: {
          pergunta: { type: 'STRING' },
          alternativas: {
            type: 'ARRAY',
            minItems: GENERATION_SIZES.options,
            maxItems: GENERATION_SIZES.options,
            items: { type: 'STRING' },
          },
          indiceCorreto: {
            type: 'INTEGER',
            description: 'Posicao da alternativa correta, começando em 0.',
          },
        },
        required: ['pergunta', 'alternativas', 'indiceCorreto'],
      },
    },
  },
  required: ['titulo', 'questoes'],
}

/** Formato exigido do Gemini para cada tipo, no subconjunto de OpenAPI dele. */
export const RESPONSE_SCHEMAS: Record<GenerationKind, object> = {
  summary: summaryResponse,
  flashcards: flashcardsResponse,
  mindMap: mindMapResponse,
  quiz: quizResponse,
}
