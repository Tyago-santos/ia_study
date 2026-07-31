import { email, z } from "zod";

export const paramsSchema = z.object({
  id: z.string(),

  data: z.object({
    email: z.email().optional(),
    name: z.string().optional(),
    password: z.string().optional(),
  }),
});

export type TypeParamsSchema = z.infer<typeof paramsSchema>;
