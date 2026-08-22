import { Router } from "express";
import { routerAuth } from "./modules/auth/router/index.js";
import { routerUsers } from "./modules/users/router/index.js";
import { routerMindMap } from "./modules/mindMap/router/index.js";
import { routerResume } from "./modules/resume/router/index.js";
import { routerSchoolSubjects } from "./modules/schoolsubjects/router/index.js";
import { routerAi } from "./modules/ai/router/index.js";
import { routerStudySessions } from "./modules/studySessions/router/index.js";

const router = Router();

router.use("/auth", routerAuth);
router.use("/users", routerUsers);
router.use("/mind-maps", routerMindMap);
router.use("/resumes", routerResume);
router.use("/school-subjects", routerSchoolSubjects);
router.use("/ai", routerAi);
router.use("/study-sessions", routerStudySessions);

export { router as mainRouter };
