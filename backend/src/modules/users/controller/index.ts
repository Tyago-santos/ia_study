import type { Request, Response } from "express";
import { UserService } from "../services/index.js";
import { AppError } from "@/shared/error/app-error.js";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getUser = async (req: Request, res: Response) => {
    const user = await this.service.getUser(req.user!.id);
    if (!user) throw new AppError("Usuário não encontrado", 404);
    return res.status(200).json({ user });
  };

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new AppError("Id inválido", 400);
    }

    const user = await this.service.getUser(id);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    return res.status(200).json({ user });
  };

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!id || typeof id !== "string") {
      throw new AppError("Id inválido", 400);
    }
    if (!data) {
      throw new AppError("Erro ao mudar os dados de usuário", 400);
    }

    const user = await this.service.updateUser(id, data);
    return res.status(200).json({ user });
  };

  createUser = async (req: Request, res: Response) => {
    const { data } = req.body;
    if (!data) {
      throw new AppError("Erro ao mudar os dados de usuário", 400);
    }

    const user = await this.service.createUser(data);
    return res.status(201).json({ user });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new AppError("Id inválido", 400);
    }

    await this.service.deleteUser(id);
    return res.status(204).send();
  };
}
