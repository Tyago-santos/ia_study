import { z } from "zod";

export const createResumeSchema = z.object({
  name: z.string().min(1).max(100),
  content: z.string().min(1),
});

export type TypeCreateResumeSchema = z.infer<typeof createResumeSchema>;
