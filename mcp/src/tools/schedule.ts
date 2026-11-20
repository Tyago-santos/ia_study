import { z } from "zod";

import { apiTool } from "./_factory.js";

export const scheduleTools = [
  apiTool({ name: "list_schedule_events", description: "Lista eventos do cronograma.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/schedule" }),
  apiTool({
    name: "create_schedule_event",
    description: "Cria um evento no cronograma.",
    profile: "full",
    schema: z.object({
      title: z.string().min(1).max(150),
      type: z.enum(["prova", "estudo", "trabalho", "aula", "outro"]),
      subjectId: z.uuid().optional(),
      date: z.iso.datetime(),
      durationMinutes: z.number().int().positive().optional(),
      description: z.string().optional(),
    }),
    method: "POST",
    path: () => "/schedule",
    body: (a) => a,
  }),
  apiTool({
    name: "update_schedule_event",
    description: "Atualiza um evento do cronograma.",
    profile: "full",
    schema: z
      .object({
        id: z.uuid(),
        title: z.string().min(1).max(150).optional(),
        type: z.enum(["prova", "estudo", "trabalho", "aula", "outro"]).optional(),
        date: z.iso.datetime().optional(),
        durationMinutes: z.number().int().positive().nullable().optional(),
        description: z.string().nullable().optional(),
        completed: z.boolean().optional(),
      })
      .refine((d) => Object.keys(d).length > 1, { message: "Informe ao menos um campo" }),
    method: "PATCH",
    path: (a) => `/schedule/${a.id}`,
    body: (a) => {
      const { id: _id, ...rest } = a;
      return rest;
    },
  }),
  apiTool({
    name: "toggle_schedule_event",
    description: "Alterna o status de conclusão de um evento.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    method: "PATCH",
    path: (a) => `/schedule/${a.id}/toggle`,
  }),
  apiTool({
    name: "delete_schedule_event",
    description: "Exclui um evento do cronograma.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/schedule/${a.id}`,
  }),
];
