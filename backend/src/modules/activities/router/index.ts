import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { ActivitiesController } from "../controller/index.js";

const router = Router();
const activitiesController = new ActivitiesController();

router.use(authMiddleware);

router.get("/recent", (req, res) => activitiesController.recent(req, res));

export { router as routerActivities };
