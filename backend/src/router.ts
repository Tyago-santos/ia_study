import { Router } from "express";
import { routerAuth } from "./modules/auth/router/index.js";
import { routerUsers } from "./modules/users/router/index.js";

const router = Router();

router.use("/auth", routerAuth);
router.use("/users", routerUsers);

export { router as mainRouter };
