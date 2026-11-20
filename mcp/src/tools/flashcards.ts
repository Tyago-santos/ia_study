import { z } from "zod";

import { apiTool } from "./_factory.js";

export const flashcardTools = [
  apiTool({
    name: "list_flashcards",
    description: "Lista flashcards, opcionalmente filtrados por matéria.",
    profile: "core",
    schema: z.object({ subjectId: z.uuid().optional() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/flashcards",
    query: (a) => ({ subjectId: a.subjectId }),
  }),
  apiTool({
    name: "flashcard_stats",
    description: "Estatísticas de flashcards.",
    profile: "core",
    schema: z.object({}),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/flashcards/stats",
  }),
  apiTool({
    name: "create_flashcard",
    description: "Cria um novo flashcard.",
    profile: "full",
    schema: z.object({
      subjectId: z.uuid(),
      front: z.string().min(1),
      back: z.string().min(1),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
    method: "POST",
    path: () => "/flashcards",
    body: (a) => a,
  }),
  apiTool({
    name: "review_flashcard",
    description: "Registra a revisão de um flashcard com a dificuldade percebida.",
    profile: "full",
    schema: z.object({ id: z.uuid(), difficulty: z.enum(["easy", "medium", "hard"]) }),
    method: "POST",
    path: (a) => `/flashcards/${a.id}/review`,
    body: (a) => ({ difficulty: a.difficulty }),
  }),
  apiTool({
    name: "delete_flashcard",
    description: "Exclui um flashcard pelo id.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/flashcards/${a.id}`,
  }),
];
