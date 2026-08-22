import type { Request, Response } from "express";

import { ScheduleService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import {
  createScheduleEventSchema,
  updateScheduleEventSchema,
} from "../schema/schedule.schema.js";

export class ScheduleController {
  private service: ScheduleService;

  constructor() {
    this.service = new ScheduleService();
  }

  async list(req: Request, res: Response) {
    const events = await this.service.getAll(req.user!.id);
    return res.status(200).json(events);
  }

  async create(req: Request, res: Response) {
    const validBody = createScheduleEventSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const event = await this.service.create(req.user!.id, validBody.data);
    return res.status(201).json(event);
  }

  async update(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = updateScheduleEventSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const event = await this.service.update(req.user!.id, validParams.data.id, validBody.data);
    return res.status(200).json(event);
  }

  async toggle(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const event = await this.service.toggle(req.user!.id, validParams.data.id);
    return res.status(200).json(event);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const event = await this.service.delete(req.user!.id, validParams.data.id);
    return res.status(200).json(event);
  }
}
