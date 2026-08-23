import expres from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { mainRouter } from "./router.js";
import { erroHandle } from "@shared/middlewares/error-handler.js";
import { env } from "@/config/env.js";

const app = expres();
// Atrás do proxy/load balancer do Render: sem isto req.protocol e req.ip
// refletem o proxy interno, não o cliente real.
app.set("trust proxy", 1);

// Limite alto por causa dos anexos da IA (imagem/PDF em base64 no corpo da requisição).
app.use(expres.json({ limit: "15mb" }));
app.use(helmet());
// `credentials: true` + origem explícita (não "*"): o front web manda o
// cookie httpOnly de sessão via `credentials: 'include'`, e o navegador só
// aceita isso com uma origem nomeada. O app mobile não passa por aqui — ele
// não é um navegador, CORS não se aplica a ele.
app.use(
  cors({
    origin: env.FRONTEND_URL.split(",").map((url) => url.trim()),
    credentials: true,
  }),
);

app.use(cookieParser());

// Health check do Render: precisa responder 200 sem autenticação nem tocar no banco.
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use(mainRouter);

app.use(erroHandle);

export { app };
