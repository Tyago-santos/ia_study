import expres from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { mainRouter } from "./router.js";
import { erroHandle } from "@shared/middlewares/error-handler.js";

const app = expres();
app.use(expres.json());
app.use(helmet());
app.use(cors());

app.use(cookieParser());

app.use(mainRouter);

app.use(erroHandle);

export { app };
