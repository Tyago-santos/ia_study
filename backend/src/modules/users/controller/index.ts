import type { Request, Response } from "express";
import { UserService } from "../services/index.js";
import { AppError } from "@/shared/error/app-error.js";
import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { createUserSchema } from "../schema/createUser.schema.js";
import { updateUserSchema } from "../schema/updateUser.schema.js";

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
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const user = await this.service.getUser(validParams.data.id);
    if (!user) throw new AppError("Usuário não encontrado", 404);

    return res.status(200).json({ user });
  };

  createUser = async (req: Request, res: Response) => {
    const validBody = createUserSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const user = await this.service.createUser(validBody.data);
    return res.status(201).json({ user });
  };

  updateUser = async (req: Request, res: Response) => {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = updateUserSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const user = await this.service.updateUser(
      validParams.data.id,
      validBody.data,
    );
    return res.status(200).json({ user });
  };

  deleteUser = async (req: Request, res: Response) => {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    await this.service.deleteUser(validParams.data.id);
    return res.status(204).send();
  };
}
