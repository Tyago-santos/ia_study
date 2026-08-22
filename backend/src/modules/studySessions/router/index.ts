import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { StudySessionsController } from "../controller/index.js";

const router = Router();
const studySessionsController = new StudySessionsController();

router.use(authMiddleware);

router.get("/dashboard", (req, res) => studySessionsController.dashboard(req, res));
router.get("/weekly", (req, res) => studySessionsController.weekly(req, res));
router.get("/subjects", (req, res) => studySessionsController.subjects(req, res));
router.post("/", (req, res) => studySessionsController.create(req, res));

export { router as routerStudySessions };
