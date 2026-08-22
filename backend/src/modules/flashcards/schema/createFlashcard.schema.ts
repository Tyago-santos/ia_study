import { z } from "zod";

export const createFlashcardSchema = z.object({
  subjectId: z.uuid(),
  front: z.string().min(1),
  back: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type TypeCreateFlashcardSchema = z.infer<typeof createFlashcardSchema>;
