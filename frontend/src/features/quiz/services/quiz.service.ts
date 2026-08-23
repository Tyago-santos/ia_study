import { quizzesApi } from '@/shared/services/quizzesApi'
import type { Quiz } from '@/shared/types'

export const quizService = {
  getAll: (params?: { subjectId?: string }) => quizzesApi.list(params?.subjectId),

  /**
   * O backend exige `questions[].id` na criacao (ver `createQuizSchema` em
   * `backend/src/modules/quiz/schema/`). O id nasce aqui, antes do POST — nao
   * ha' um "servidor fake" que gere isso mais pra frente como no mock.
   */
  create: (data: {
    subjectId: string
    title: string
    questions: { question: string; options: string[]; correctAnswer: number }[]
  }) =>
    quizzesApi.create({
      subjectId: data.subjectId,
      title: data.title,
      questions: data.questions.map((q) => ({ id: crypto.randomUUID(), ...q })),
    }),

  /**
   * O shape real de `POST /quizzes/:id/submit` (`{score, correct, total}`,
   * confirmado em `backend/src/modules/quiz/services/index.ts`) nao bate com
   * o que o mock devolvia: la' `score` era a contagem de acertos, aqui
   * `score` ja e' a porcentagem e `correct` e' a contagem. `QuizResult`/
   * `useQuizSession` esperam `{score: acertos, percentage, total}` — o
   * mapeamento abaixo traduz um pro outro.
   */
  submit: async (id: string, data: { answers: Record<string, number> }) => {
    const result = await quizzesApi.submit({ quizId: id, answers: data.answers })
    return {
      score: result.correct,
      total: result.total,
      percentage: result.score,
    }
  },

  /**
   * MOCKADO DE PROPOSITO: o backend do quiz so' persiste, nao gera conteudo
   * (nao ha' rota de geracao no modulo quiz). Uma geracao real dependeria da
   * pipeline de IA que ja existe em `frontend/src/features/ai/` (prompt,
   * schema de resposta, `generateJson`) — fora do escopo desta tarefa, que so'
   * cobre biblioteca/flashcards/quiz/search. Em vez de fingir sucesso sem
   * persistir nada (o que some ao recarregar a pagina), isso aqui cria e
   * salva de verdade um quiz placeholder via `POST /quizzes` real.
   */
  generateWithAI: async (subjectId: string, topic?: string): Promise<Quiz> => {
    return quizzesApi.create({
      subjectId,
      title: topic ? `Quiz: ${topic}` : 'Quiz Gerado por IA',
      questions: [
        {
          id: crypto.randomUUID(),
          question: 'Pergunta gerada pela IA?',
          options: ['Opcao A', 'Opcao B', 'Opcao C', 'Opcao D'],
          correctAnswer: 0,
        },
      ],
    })
  },
}
