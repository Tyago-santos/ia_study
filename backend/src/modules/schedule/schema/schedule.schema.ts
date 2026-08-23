import { z } from "zod";

export const createScheduleEventSchema = z.object({
  title: z.string().min(1).max(150),
  type: z.enum(["prova", "estudo", "trabalho", "aula", "outro"]),
  subjectId: z.uuid().optional(),
  /** ISO completo; a hora dentro dele e' o horario marcado do evento. */
  date: z.iso.datetime(),
  durationMinutes: z.number().int().positive().optional(),
  description: z.string().optional(),
});

export type TypeCreateScheduleEventSchema = z.infer<typeof createScheduleEventSchema>;

export const updateScheduleEventSchema = z
  .object({
    title: z.string().min(1).max(150).optional(),
    type: z.enum(["prova", "estudo", "trabalho", "aula", "outro"]).optional(),
    date: z.iso.datetime().optional(),
    durationMinutes: z.number().int().positive().nullable().optional(),
    description: z.string().nullable().optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type TypeUpdateScheduleEventSchema = z.infer<typeof updateScheduleEventSchema>;

/**
 * Arrastar para outro dia e adiar uma semana nao tem rota propria: o app manda
 * a data ja calculada por este mesmo `update`. O calculo depende do fuso de
 * quem arrastou — feito aqui, no servidor (UTC), um arrasto as 21h no Brasil
 * cairia no dia seguinte.
 */
