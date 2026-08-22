import { z } from "zod";

export const createSchoolSubjectSchema = z.object({
  name: z.string().min(1).max(100),
  answer: z.string().min(1),
  response: z.string().min(1),
});

export type TypeCreateSchoolSubjectSchema = z.infer<typeof createSchoolSubjectSchema>;
