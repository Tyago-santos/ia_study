import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { FlashcardsController } from "../controller/index.js";

const router = Router();
const flashcardsController = new FlashcardsController();

router.use(authMiddleware);

router.get("/", (req, res) => flashcardsController.list(req, res));
router.get("/stats", (req, res) => flashcardsController.stats(req, res));
router.post("/", (req, res) => flashcardsController.create(req, res));
router.delete("/:id", (req, res) => flashcardsController.delete(req, res));

export { router as routerFlashcards };
