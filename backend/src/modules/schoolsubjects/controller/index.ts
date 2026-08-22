import type { Request, Response } from "express";

import { SchoolSubjectsService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { createSchoolSubjectSchema } from "../schema/createSchoolSubject.schema.js";
import { updateSchoolSubjectSchema } from "../schema/updateSchoolSubject.schema.js";

export class SchoolSubjectsController {
  private service: SchoolSubjectsService;

  constructor() {
    this.service = new SchoolSubjectsService();
  }

  async list(req: Request, res: Response) {
    const subjects = await this.service.getAll(req.user!.id);
    return res.status(200).json(subjects);
  }

  async getById(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const subject = await this.service.getById(req.user!.id, validParams.data.id);
    return res.status(200).json(subject);
  }

  async create(req: Request, res: Response) {
    const validBody = createSchoolSubjectSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const subject = await this.service.create(req.user!.id, validBody.data);
    return res.status(201).json(subject);
  }

  async update(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = updateSchoolSubjectSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const subject = await this.service.update(
      req.user!.id,
      validParams.data.id,
      validBody.data,
    );

    return res.status(200).json(subject);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const subject = await this.service.delete(req.user!.id, validParams.data.id);

    return res.status(200).json(subject);
  }
}
