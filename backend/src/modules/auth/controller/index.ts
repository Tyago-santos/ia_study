import type { Request, Response } from "express";

import { AuthService } from "../services/index.js";
import { loginSchema } from "../schema/login.schema.js";
import { env } from "@/config/env.js";
import { registerSchema } from "../schema/register.schema.js";
import { httpUrl } from "zod";

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

    res.cookie("accesToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      id: user.id,
      name: user.name,
    });
  }

  async register(req: Request, res: Response) {
    const validadeSchemaRegister = registerSchema.safeParse(req.body);

    if (!validadeSchemaRegister.success) throw validadeSchemaRegister.error;

    const { token, user } = await this.service.register(
      validadeSchemaRegister.data,
    );

    res.cookie("accesToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
    });
  }
}
