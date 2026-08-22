import type { Request, Response } from "express";

import { PlannerService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import {
  createPlanBlockSchema,
  updatePlanBlockSchema,
  updateWeeklyGoalSchema,
} from "../schema/planner.schema.js";

export class PlannerController {
  private service: PlannerService;

  constructor() {
    this.service = new PlannerService();
  }

  async getWeek(req: Request, res: Response) {
    const week = await this.service.getWeek(req.user!.id);
    return res.status(200).json(week);
  }

  async createBlock(req: Request, res: Response) {
    const validBody = createPlanBlockSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const block = await this.service.createBlock(req.user!.id, validBody.data);
    return res.status(201).json(block);
  }

  async updateBlock(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = updatePlanBlockSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const block = await this.service.updateBlock(
      req.user!.id,
      validParams.data.id,
      validBody.data,
    );
    return res.status(200).json(block);
  }

  async deleteBlock(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const block = await this.service.deleteBlock(req.user!.id, validParams.data.id);
    return res.status(200).json(block);
  }

  async setWeeklyGoal(req: Request, res: Response) {
    const validBody = updateWeeklyGoalSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const goal = await this.service.setWeeklyGoal(
      req.user!.id,
      validBody.data.weeklyGoalMinutes,
    );
    return res.status(200).json(goal);
  }
}
