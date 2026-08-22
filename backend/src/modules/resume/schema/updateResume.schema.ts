import { z } from "zod";

export const updateResumeSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    content: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type TypeUpdateResumeSchema = z.infer<typeof updateResumeSchema>;
