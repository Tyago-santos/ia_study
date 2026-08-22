import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { TopicsController } from "../controller/index.js";

const router = Router();
const topicsController = new TopicsController();

router.use(authMiddleware);

router.get("/", (req, res) => topicsController.list(req, res));
router.post("/", (req, res) => topicsController.create(req, res));
router.patch("/:id/toggle", (req, res) => topicsController.toggle(req, res));
router.delete("/:id", (req, res) => topicsController.delete(req, res));

export { router as routerTopics };
