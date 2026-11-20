import { z } from "zod";

import { apiTool } from "./_factory.js";

export const activityTools = [
  apiTool({
    name: "recent_activities",
    description: "Lista atividades recentes do usuário (limite até 50).",
    profile: "core",
    schema: z.object({ limit: z.number().int().positive().max(50).optional() }),
    annotations: { readOnlyHint: true },
    method: "GET",
    path: () => "/activities/recent",
    query: (a) => ({ limit: a.limit }),
  }),
];
