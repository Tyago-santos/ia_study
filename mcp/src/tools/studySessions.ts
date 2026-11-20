import { z } from "zod";

import { apiTool } from "./_factory.js";

export const studySessionTools = [
  apiTool({ name: "study_dashboard", description: "Resumo do dashboard de estudos.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/study-sessions/dashboard" }),
  apiTool({ name: "study_weekly", description: "Dados de estudo da semana.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/study-sessions/weekly" }),
  apiTool({ name: "study_by_subject", description: "Tempo de estudo por matéria.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/study-sessions/subjects" }),
  apiTool({ name: "study_contributions", description: "Contribuições (heatmap) de estudo.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/study-sessions/contributions" }),
  apiTool({ name: "study_pomodoro", description: "Estatísticas de pomodoro.", profile: "core", schema: z.object({}), annotations: { readOnlyHint: true }, method: "GET", path: () => "/study-sessions/pomodoro" }),
  apiTool({
    name: "create_study_session",
    description: "Registra uma sessão de estudo.",
    profile: "full",
    schema: z.object({
      subjectId: z.string().optional(),
      subjectName: z.string().optional(),
      duration: z.number().int().positive(),
      type: z.enum(["pomodoro", "free"]).default("free"),
      completedAt: z.iso.datetime().optional(),
    }),
    method: "POST",
    path: () => "/study-sessions",
    body: (a) => a,
  }),
];
