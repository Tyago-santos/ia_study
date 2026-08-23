import { Router } from "express";

import { AuthController } from "../controller/index.js";

const router = Router();
const authController = new AuthController();

router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));

export { router as routerAuth };
