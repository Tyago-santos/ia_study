import { z } from "zod";

export const reviewFlashcardSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type TypeReviewFlashcardSchema = z.infer<typeof reviewFlashcardSchema>;
