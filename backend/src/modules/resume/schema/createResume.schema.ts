import { z } from "zod";

export const createResumeSchema = z.object({
  name: z.string().min(1).max(100),
  content: z.string().min(1),
  subjectId: z.string().uuid(),
  sourceType: z.enum(["text", "pdf", "image"]).default("text"),
});

export type TypeCreateResumeSchema = z.infer<typeof createResumeSchema>;
