import { z } from "zod";

export const updateSchoolSubjectSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    answer: z.string().min(1).optional(),
    response: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type TypeUpdateSchoolSubjectSchema = z.infer<typeof updateSchoolSubjectSchema>;
