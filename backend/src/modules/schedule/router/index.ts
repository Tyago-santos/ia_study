import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { ScheduleController } from "../controller/index.js";

const router = Router();
const scheduleController = new ScheduleController();

router.use(authMiddleware);

router.get("/", (req, res) => scheduleController.list(req, res));
router.post("/", (req, res) => scheduleController.create(req, res));
router.patch("/:id", (req, res) => scheduleController.update(req, res));
router.patch("/:id/toggle", (req, res) => scheduleController.toggle(req, res));
router.delete("/:id", (req, res) => scheduleController.delete(req, res));

export { router as routerSchedule };
