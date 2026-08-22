import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(30).optional(),
    email: z.email().optional(),
    password: z.string().min(6).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type TypeUpdateUserSchema = z.infer<typeof updateUserSchema>;
