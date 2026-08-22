import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { AiController } from "../controller/index.js";

const router = Router();
const aiController = new AiController();

router.use(authMiddleware);

router.get("/status", (req, res) => aiController.status(req, res));
router.post("/generate", (req, res) => aiController.generate(req, res));
router.post("/generate-json", (req, res) => aiController.generateJson(req, res));
router.post("/transcribe", (req, res) => aiController.transcribe(req, res));
router.post("/extract-pdf", (req, res) => aiController.extractPdf(req, res));

export { router as routerAi };
