import type { Request, Response } from "express";

import { ActivitiesService } from "../services/index.js";

const MAX_LIMIT = 50;

export class ActivitiesController {
  private service: ActivitiesService;

  constructor() {
    this.service = new ActivitiesService();
  }

  async recent(req: Request, res: Response) {
    const parsedLimit = Number(req.query.limit);
    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, MAX_LIMIT)
        : undefined;

    const activities = await this.service.recent(req.user!.id, limit);
    return res.status(200).json(activities);
  }
}
