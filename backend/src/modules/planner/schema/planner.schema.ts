import { z } from "zod";

/** 0 = domingo ... 6 = sábado, igual ao `Date#getDay` do app. */
const weekday = z.number().int().min(0).max(6);

export const createPlanBlockSchema = z.object({
  weekday,
  subjectId: z.uuid().optional(),
  subjectName: z.string().min(1),
  subjectColor: z.string().min(1),
  duration: z.number().int().positive(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato "HH:MM"')
    .optional(),
  topicId: z.uuid().optional(),
  topicName: z.string().optional(),
});

export type TypeCreatePlanBlockSchema = z.infer<typeof createPlanBlockSchema>;

/**
 * Campos opcionais que aceitam `null` para limpar: o app precisa conseguir
 * tirar o horario ou o assunto de um bloco, e omitir o campo significa
 * "nao mexe nele".
 */
export const updatePlanBlockSchema = z
  .object({
    weekday: weekday.optional(),
    duration: z.number().int().positive().optional(),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato "HH:MM"')
      .nullable()
      .optional(),
    topicId: z.uuid().nullable().optional(),
    topicName: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type TypeUpdatePlanBlockSchema = z.infer<typeof updatePlanBlockSchema>;

export const updateWeeklyGoalSchema = z.object({
  weeklyGoalMinutes: z.number().int().min(0),
});

export type TypeUpdateWeeklyGoalSchema = z.infer<typeof updateWeeklyGoalSchema>;
