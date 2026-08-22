import { z } from "zod";

export const updateMindMapSchema = z
  .object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type TypeUpdateMindMapSchema = z.infer<typeof updateMindMapSchema>;
