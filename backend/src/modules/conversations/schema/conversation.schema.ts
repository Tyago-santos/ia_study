import { z } from "zod";

export const createConversationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
});

export type TypeCreateConversationSchema = z.infer<typeof createConversationSchema>;

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(100),
});

export type TypeUpdateConversationSchema = z.infer<typeof updateConversationSchema>;

export const createMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(50000),
});

export type TypeCreateMessageSchema = z.infer<typeof createMessageSchema>;
