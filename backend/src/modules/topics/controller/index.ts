import type { Request, Response } from "express";

import { TopicsService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { createTopicSchema } from "../schema/createTopic.schema.js";

export class TopicsController {
  private service: TopicsService;

  constructor() {
    this.service = new TopicsService();
  }

  async list(req: Request, res: Response) {
    const topics = await this.service.getAll(req.user!.id);
    return res.status(200).json(topics);
  }

  async create(req: Request, res: Response) {
    const validBody = createTopicSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const topic = await this.service.create(req.user!.id, validBody.data);
    return res.status(201).json(topic);
  }

  async toggle(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const topic = await this.service.toggle(req.user!.id, validParams.data.id);
    return res.status(200).json(topic);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const topic = await this.service.delete(req.user!.id, validParams.data.id);
    return res.status(200).json(topic);
  }
}
