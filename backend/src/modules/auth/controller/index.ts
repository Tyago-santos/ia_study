import type { Request, Response } from "express";

import { AuthService } from "../services/index.js";
import { loginSchema } from "../schema/login.schema.js";
import { env } from "@/config/env.js";
import { registerSchema } from "../schema/register.schema.js";

/**
 * `sameSite: "none"` em produção porque o front web e o backend vivem em
 * domínios diferentes (Vercel + Render) — cookie entre domínios diferentes
 * só sai com `None`, e `None` só é aceito pelo navegador junto de `Secure`.
 * Em dev os dois são `localhost` (portas diferentes, mas mesmo site), então
 * `strict` já basta e evita depender de HTTPS local.
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: (env.NODE_ENV === "production" ? "none" : "strict") as "none" | "strict",
};

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const validadeSchema = loginSchema.safeParse({ email, password });

    if (!validadeSchema.success) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const { token, user } = await this.service.login(email, password);

    res.cookie("accesToken", token, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });

    req.user = user;

    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  }

  async register(req: Request, res: Response) {
    const validadeSchemaRegister = registerSchema.safeParse(req.body);

    if (!validadeSchemaRegister.success) throw validadeSchemaRegister.error;

    const { token, user } = await this.service.register(
      validadeSchemaRegister.data,
    );

    res.cookie("accesToken", token, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });

    req.user = user;

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie("accesToken", COOKIE_OPTIONS);
    return res.status(204).send();
  }
}
