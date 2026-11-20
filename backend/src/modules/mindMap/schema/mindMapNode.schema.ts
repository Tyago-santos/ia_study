import { z } from "zod";

export const createMindMapNodeSchema = z.object({
  label: z.string().min(1).max(200),
  note: z.string().optional(),
  color: z.string().optional(),
  parentId: z.uuid().optional().nullable(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  collapsed: z.boolean().optional(),
});

export type TypeCreateMindMapNodeSchema = z.infer<typeof createMindMapNodeSchema>;

export const updateMindMapNodeSchema = z
  .object({
    label: z.string().min(1).max(200).optional(),
    note: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    parentId: z.uuid().nullable().optional(),
    positionX: z.number().nullable().optional(),
    positionY: z.number().nullable().optional(),
    collapsed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type TypeUpdateMindMapNodeSchema = z.infer<typeof updateMindMapNodeSchema>;
