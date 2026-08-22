import { z } from "zod";

export const createTopicSchema = z.object({
  subjectId: z.uuid(),
  name: z.string().min(1).max(150),
});

export type TypeCreateTopicSchema = z.infer<typeof createTopicSchema>;
