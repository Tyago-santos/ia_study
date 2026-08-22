import { z } from "zod";

export const paramsSchema = z.object({
  id: z.uuid(),
});

export type TypeParamsSchema = z.infer<typeof paramsSchema>;
