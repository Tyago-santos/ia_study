import type { Request, Response } from "express";

import { SubjectsService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { createSubjectSchema } from "../schema/createSubject.schema.js";

export class SubjectsController {
  private service: SubjectsService;

  constructor() {
    this.service = new SubjectsService();
  }

  async list(req: Request, res: Response) {
    const subjects = await this.service.getAll(req.user!.id);
    return res.status(200).json(subjects);
  }

  async create(req: Request, res: Response) {
    const validBody = createSubjectSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const subject = await this.service.create(req.user!.id, validBody.data);
    return res.status(201).json(subject);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const subject = await this.service.delete(req.user!.id, validParams.data.id);
    return res.status(200).json(subject);
  }
}
