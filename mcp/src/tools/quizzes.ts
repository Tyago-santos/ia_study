import { z } from "zod";

import { apiTool } from "./_factory.js";

const questionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.number().int().min(0),
});

export const quizTools = [
  apiTool({
    name: "list_quizzes",
    description: "Lista quizzes, opcionalmente filtrados por matéria.",
    profile: "core",
    schema: z.object({ subjectId: z.uuid().optional() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/quizzes",
    query: (a) => ({ subjectId: a.subjectId }),
  }),
  apiTool({
    name: "quiz_stats",
    description: "Estatísticas de quizzes.",
    profile: "core",
    schema: z.object({}),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/quizzes/stats",
  }),
  apiTool({
    name: "create_quiz",
    description: "Cria um novo quiz.",
    profile: "full",
    schema: z.object({
      subjectId: z.uuid(),
      title: z.string().min(1).max(100),
      questions: z.array(questionSchema).min(1),
    }),
    method: "POST",
    path: () => "/quizzes",
    body: (a) => a,
  }),
  apiTool({
    name: "submit_quiz",
    description: "Envia as respostas de um quiz e retorna o resultado.",
    profile: "full",
    schema: z.object({
      id: z.uuid(),
      answers: z.record(z.string().min(1), z.number().int().min(0)),
    }),
    method: "POST",
    path: (a) => `/quizzes/${a.id}/submit`,
    body: (a) => ({ answers: a.answers }),
  }),
  apiTool({
    name: "delete_quiz",
    description: "Exclui um quiz pelo id.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/quizzes/${a.id}`,
  }),
];
