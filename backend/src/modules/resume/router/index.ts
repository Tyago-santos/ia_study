import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { ResumeController } from "../controller/index.js";

const router = Router();
const resumeController = new ResumeController();

router.use(authMiddleware);

router.get("/", (req, res) => resumeController.list(req, res));
router.get("/:id", (req, res) => resumeController.getById(req, res));
router.post("/", (req, res) => resumeController.create(req, res));
router.patch("/:id", (req, res) => resumeController.update(req, res));
router.delete("/:id", (req, res) => resumeController.delete(req, res));

export { router as routerResume };
