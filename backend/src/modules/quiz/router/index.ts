import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { QuizController } from "../controller/index.js";

const router = Router();
const quizController = new QuizController();

router.use(authMiddleware);

router.get("/", (req, res) => quizController.list(req, res));
// Antes de qualquer "/:id": senao o /:id casaria com "stats" e devolveria 400.
router.get("/stats", (req, res) => quizController.stats(req, res));
router.post("/", (req, res) => quizController.create(req, res));
router.post("/:id/submit", (req, res) => quizController.submit(req, res));
router.delete("/:id", (req, res) => quizController.delete(req, res));

export { router as routerQuiz };
