import { z } from "zod";

import { apiTool } from "./_factory.js";

const weekday = z.number().int().min(0).max(6);

export const plannerTools = [
  apiTool({ name: "get_week_plan", description: "Busca o plano de estudos da semana.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/planner" }),
  apiTool({
    name: "set_weekly_goal",
    description: "Define a meta semanal de minutos de estudo.",
    profile: "full",
    schema: z.object({ weeklyGoalMinutes: z.number().int().min(0) }),
    method: "PUT",
    path: () => "/planner/goal",
    body: (a) => a,
  }),
  apiTool({
    name: "create_plan_block",
    description: "Cria um bloco de estudo no planner.",
    profile: "full",
    schema: z.object({
      weekday,
      subjectId: z.uuid().optional(),
      subjectName: z.string().min(1),
      subjectColor: z.string().min(1),
      duration: z.number().int().positive(),
      startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      topicId: z.uuid().optional(),
      topicName: z.string().optional(),
    }),
    method: "POST",
    path: () => "/planner/blocks",
    body: (a) => a,
  }),
  apiTool({
    name: "update_plan_block",
    description: "Atualiza um bloco de estudo.",
    profile: "full",
    schema: z
      .object({
        id: z.uuid(),
        weekday: weekday.optional(),
        duration: z.number().int().positive().optional(),
        startTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
        topicId: z.uuid().nullable().optional(),
        topicName: z.string().nullable().optional(),
      })
      .refine((d) => Object.keys(d).length > 1, { message: "Informe ao menos um campo" }),
    method: "PATCH",
    path: (a) => `/planner/blocks/${a.id}`,
    body: (a) => {
      const { id: _id, ...rest } = a;
      return rest;
    },
  }),
  apiTool({
    name: "delete_plan_block",
    description: "Exclui um bloco de estudo.",
    profile: "full",
    schema: z.object({ id: z.uuid() }),
    annotations: { destructiveHint: true },
    method: "DELETE",
    path: (a) => `/planner/blocks/${a.id}`,
  }),
];
