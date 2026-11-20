import { activityTools } from "./activities.js";
import { aiTools } from "./ai.js";
import { conversationTools } from "./conversations.js";
import { flashcardTools } from "./flashcards.js";
import { mindMapTools } from "./mindMaps.js";
import { plannerTools } from "./planner.js";
import { quizTools } from "./quizzes.js";
import { resumeTools } from "./resumes.js";
import { scheduleTools } from "./schedule.js";
import { sessionTools } from "./session.js";
import { studySessionTools } from "./studySessions.js";
import { subjectTools } from "./subjects.js";
import { topicTools } from "./topics.js";
import { userTools } from "./users.js";

import type { AnyToolDefinition } from "./types.js";

export const allTools: AnyToolDefinition[] = [
  ...sessionTools,
  ...subjectTools,
  ...topicTools,
  ...resumeTools,
  ...mindMapTools,
  ...studySessionTools,
  ...flashcardTools,
  ...quizTools,
  ...plannerTools,
  ...scheduleTools,
  ...conversationTools,
  ...activityTools,
  ...aiTools,
  ...userTools,
];
