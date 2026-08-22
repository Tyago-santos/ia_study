import type { Request, Response } from "express";

import { ResumeService } from "../services/index.js";

import { AppError } from "@/shared/error/app-error.js";
import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { updateResumeSchema } from "../schema/updateResume.schema.js";
import { createResumeSchema } from "../schema/createResume.schema.js";

export class ResumeController {
  private service: ResumeService;

  constructor() {
    this.service = new ResumeService();
  }

  async list(req: Request, res: Response) {
    const resumes = await this.service.getAll(req.user!.id);
    return res.status(200).json(resumes);
  }

  async getById(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const resume = await this.service.getById(req.user!.id, validParams.data.id);
    return res.status(200).json(resume);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const subject = await this.service.delete(
      req.user!.id,
      validParams.data.id,
    );

    return res.status(200).json({ message: "resumo deletado com sucesso" });
  }

  async update(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = updateResumeSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const resume = await this.service.update(
      req.user!.id,
      validParams.data.id,
      validBody.data,
    );

    return res.status(200).json(resume);
  }

  async create(req: Request, res: Response) {
    const validBody = createResumeSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const resume = await this.service.create(req.user!.id, validBody.data);

    return res.status(201).json(resume);
  }
}
