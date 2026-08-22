import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { SchoolSubjectsController } from "../controller/index.js";

const router = Router();
const schoolSubjectsController = new SchoolSubjectsController();

router.use(authMiddleware);

router.get("/", (req, res) => schoolSubjectsController.list(req, res));
router.get("/:id", (req, res) => schoolSubjectsController.getById(req, res));
router.post("/", (req, res) => schoolSubjectsController.create(req, res));
router.patch("/:id", (req, res) => schoolSubjectsController.update(req, res));
router.delete("/:id", (req, res) => schoolSubjectsController.delete(req, res));

export { router as routerSchoolSubjects };
