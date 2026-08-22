import { z } from "zod";

export const createStudySessionSchema = z.object({
  subjectId: z.string().optional(),
  subjectName: z.string().optional(),
  duration: z.number().int().positive(),
  type: z.enum(["pomodoro", "free"]).default("free"),
  completedAt: z.iso.datetime().optional(),
});

export type TypeCreateStudySessionSchema = z.infer<typeof createStudySessionSchema>;
