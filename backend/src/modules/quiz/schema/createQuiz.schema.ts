import { z } from "zod";

export const questionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.number().int().min(0),
});

export const createQuizSchema = z.object({
  subjectId: z.uuid(),
  title: z.string().min(1).max(100),
  questions: z.array(questionSchema).min(1),
});

export const submitQuizSchema = z.object({
  answers: z.record(z.string().min(1), z.number().int().min(0)),
});

export type TypeCreateQuizSchema = z.infer<typeof createQuizSchema>;
export type TypeSubmitQuizSchema = z.infer<typeof submitQuizSchema>;
