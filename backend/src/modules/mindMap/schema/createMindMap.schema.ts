import { z } from "zod";

export const createMindMapSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  subjectId: z.uuid(),
});

export type TypeCreateMindMapSchema = z.infer<typeof createMindMapSchema>;
