import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().min(1),
  icon: z.string().optional(),
});

export type TypeCreateSubjectSchema = z.infer<typeof createSubjectSchema>;
