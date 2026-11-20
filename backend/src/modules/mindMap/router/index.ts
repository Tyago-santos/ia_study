import { Router } from "express";

import { authMiddleware } from "@modules/auth/middleware/auth.js";
import { MindMapController } from "../controller/index.js";

const router = Router();
const mindMapController = new MindMapController();

router.use(authMiddleware);

router.get("/", (req, res) => mindMapController.list(req, res));
router.get("/:id", (req, res) => mindMapController.getById(req, res));
router.post("/", (req, res) => mindMapController.create(req, res));
router.patch("/:id", (req, res) => mindMapController.update(req, res));
router.delete("/:id", (req, res) => mindMapController.delete(req, res));

router.post("/:id/nodes", (req, res) => mindMapController.createNode(req, res));
router.patch("/:id/nodes/:nodeId", (req, res) => mindMapController.updateNode(req, res));
router.delete("/:id/nodes/:nodeId", (req, res) => mindMapController.deleteNode(req, res));

export { router as routerMindMap };
