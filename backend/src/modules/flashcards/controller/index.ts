import type { Request, Response } from "express";

import { FlashcardsService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import { createFlashcardSchema } from "../schema/createFlashcard.schema.js";
import { reviewFlashcardSchema } from "../schema/reviewFlashcard.schema.js";

export class FlashcardsController {
  private service: FlashcardsService;

  constructor() {
    this.service = new FlashcardsService();
  }

  async list(req: Request, res: Response) {
    const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
    const flashcards = await this.service.getAll(req.user!.id, subjectId);
    return res.status(200).json(flashcards);
  }

  async stats(req: Request, res: Response) {
    const stats = await this.service.stats(req.user!.id);
    return res.status(200).json(stats);
  }

  async create(req: Request, res: Response) {
    const validBody = createFlashcardSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const flashcard = await this.service.create(req.user!.id, validBody.data);
    return res.status(201).json(flashcard);
  }

  async review(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = reviewFlashcardSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const flashcard = await this.service.review(req.user!.id, validParams.data.id, validBody.data);
    return res.status(200).json(flashcard);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const flashcard = await this.service.delete(req.user!.id, validParams.data.id);
    return res.status(200).json(flashcard);
  }
}
