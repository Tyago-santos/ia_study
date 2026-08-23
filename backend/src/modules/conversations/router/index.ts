import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { ConversationController } from "../controller/index.js";

const router = Router();
const conversationController = new ConversationController();

router.use(authMiddleware);

router.get("/", (req, res) => conversationController.list(req, res));
router.post("/", (req, res) => conversationController.create(req, res));
router.patch("/:id", (req, res) => conversationController.rename(req, res));
router.delete("/:id", (req, res) => conversationController.delete(req, res));
router.get("/:id/messages", (req, res) => conversationController.listMessages(req, res));
router.post("/:id/messages", (req, res) => conversationController.addMessage(req, res));
router.delete("/:id/messages", (req, res) => conversationController.clearMessages(req, res));

export { router as routerConversations };
