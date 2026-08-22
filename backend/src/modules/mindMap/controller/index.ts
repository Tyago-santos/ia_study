import type { Request, Response } from "express";

import { MindMapsService } from "../services/index.js";

import { AppError } from "@/shared/error/app-error.js";
import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { updateMindMapSchema } from "../schema/updateMindMap.schema.js";
import { createMindMapSchema } from "../schema/createMindMap.schema.js";

export class MindMapController {
  private service: MindMapsService;

  constructor() {
    this.service = new MindMapsService();
  }

  async list(req: Request, res: Response) {
    const mindMaps = await this.service.getAll(req.user!.id);
    return res.status(200).json(mindMaps);
  }

  async getById(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const mindMap = await this.service.getById(req.user!.id, validParams.data.id);
    return res.status(200).json(mindMap);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    await this.service.delete(req.user!.id, validParams.data.id);

    return res.status(200).json({ message: "mapa mental deletado com sucesso" });
  }

  async update(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = updateMindMapSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const mindMap = await this.service.update(
      req.user!.id,
      validParams.data.id,
      validBody.data,
    );

    return res.status(200).json(mindMap);
  }

  async create(req: Request, res: Response) {
    const validBody = createMindMapSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const mindMap = await this.service.create(req.user!.id, validBody.data);

    return res.status(201).json(mindMap);
  }
}
