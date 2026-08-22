import type { Request, Response } from "express";

import { StudySessionsService } from "../services/index.js";
import { createStudySessionSchema } from "../schema/createStudySession.schema.js";

export class StudySessionsController {
  private service: StudySessionsService;

  constructor() {
    this.service = new StudySessionsService();
  }

  async create(req: Request, res: Response) {
    const validBody = createStudySessionSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const session = await this.service.create(req.user!.id, validBody.data);
    return res.status(201).json(session);
  }

  async dashboard(req: Request, res: Response) {
    const stats = await this.service.dashboard(req.user!.id);
    return res.status(200).json(stats);
  }

  async weekly(req: Request, res: Response) {
    const weekly = await this.service.weekly(req.user!.id);
    return res.status(200).json(weekly);
  }

  async subjects(req: Request, res: Response) {
    const subjects = await this.service.subjects(req.user!.id);
    return res.status(200).json(subjects);
  }
}
