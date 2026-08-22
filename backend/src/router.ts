import { Router } from "express";
import { routerAuth } from "./modules/auth/router/index.js";
import { routerUsers } from "./modules/users/router/index.js";
import { routerMindMap } from "./modules/mindMap/router/index.js";
import { routerResume } from "./modules/resume/router/index.js";
import { routerSubjects } from "./modules/subjects/router/index.js";
import { routerTopics } from "./modules/topics/router/index.js";
import { routerAi } from "./modules/ai/router/index.js";
import { routerStudySessions } from "./modules/studySessions/router/index.js";
import { routerFlashcards } from "./modules/flashcards/router/index.js";
import { routerQuiz } from "./modules/quiz/router/index.js";
import { routerPlanner } from "./modules/planner/router/index.js";
import { routerSchedule } from "./modules/schedule/router/index.js";

const router = Router();

router.use("/auth", routerAuth);
router.use("/users", routerUsers);
router.use("/mind-maps", routerMindMap);
router.use("/resumes", routerResume);
router.use("/subjects", routerSubjects);
router.use("/topics", routerTopics);
router.use("/ai", routerAi);
router.use("/study-sessions", routerStudySessions);
router.use("/flashcards", routerFlashcards);
router.use("/quizzes", routerQuiz);
router.use("/planner", routerPlanner);
router.use("/schedule", routerSchedule);

export { router as mainRouter };
