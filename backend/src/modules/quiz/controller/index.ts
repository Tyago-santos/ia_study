import type { Request, Response } from "express";

import { QuizService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { createQuizSchema, submitQuizSchema } from "../schema/createQuiz.schema.js";

export class QuizController {
  private service: QuizService;

  constructor() {
    this.service = new QuizService();
  }

  async list(req: Request, res: Response) {
    const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
    const quizzes = await this.service.getAll(req.user!.id, subjectId);
    return res.status(200).json(quizzes);
  }

  async stats(req: Request, res: Response) {
    const stats = await this.service.stats(req.user!.id);
    return res.status(200).json(stats);
  }

  async create(req: Request, res: Response) {
    const validBody = createQuizSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const quiz = await this.service.create(req.user!.id, validBody.data);
    return res.status(201).json(quiz);
  }

  async submit(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = submitQuizSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const result = await this.service.submit(req.user!.id, validParams.data.id, validBody.data);
    return res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const quiz = await this.service.delete(req.user!.id, validParams.data.id);
    return res.status(200).json(quiz);
  }
}
