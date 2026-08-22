import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { SubjectsController } from "../controller/index.js";

const router = Router();
const subjectsController = new SubjectsController();

router.use(authMiddleware);

router.get("/", (req, res) => subjectsController.list(req, res));
router.post("/", (req, res) => subjectsController.create(req, res));
router.delete("/:id", (req, res) => subjectsController.delete(req, res));

export { router as routerSubjects };
