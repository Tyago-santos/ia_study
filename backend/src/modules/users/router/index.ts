import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { UserController } from "../controller/index.js";

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.get("/me", userController.getUser);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export { router as routerUsers };
