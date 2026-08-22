import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { PlannerController } from "../controller/index.js";

const router = Router();
const plannerController = new PlannerController();

router.use(authMiddleware);

router.get("/", (req, res) => plannerController.getWeek(req, res));
// Antes de "/:id": senao o /:id casaria com "goal".
router.put("/goal", (req, res) => plannerController.setWeeklyGoal(req, res));
router.post("/blocks", (req, res) => plannerController.createBlock(req, res));
router.patch("/blocks/:id", (req, res) => plannerController.updateBlock(req, res));
router.delete("/blocks/:id", (req, res) => plannerController.deleteBlock(req, res));

export { router as routerPlanner };
