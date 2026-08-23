import type { Request, Response } from "express";

import { ConversationService } from "../services/index.js";

import { paramsSchema } from "@/shared/schema/paramsValidate.js";
import {
  createConversationSchema,
  createMessageSchema,
  updateConversationSchema,
} from "../schema/conversation.schema.js";

export class ConversationController {
  private service: ConversationService;

  constructor() {
    this.service = new ConversationService();
  }

  async list(req: Request, res: Response) {
    const conversations = await this.service.getAll(req.user!.id);
    return res.status(200).json(conversations);
  }

  async create(req: Request, res: Response) {
    const validBody = createConversationSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const conversation = await this.service.create(req.user!.id, validBody.data.title);
    return res.status(201).json(conversation);
  }

  async rename(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = updateConversationSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const conversation = await this.service.rename(
      req.user!.id,
      validParams.data.id,
      validBody.data.title,
    );
    return res.status(200).json(conversation);
  }

  async delete(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const conversation = await this.service.delete(req.user!.id, validParams.data.id);
    return res.status(200).json(conversation);
  }

  async listMessages(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const messages = await this.service.listMessages(req.user!.id, validParams.data.id);
    return res.status(200).json(messages);
  }

  async addMessage(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    const validBody = createMessageSchema.safeParse(req.body);
    if (!validBody.success) throw validBody.error;

    const message = await this.service.addMessage(
      req.user!.id,
      validParams.data.id,
      validBody.data,
    );
    return res.status(201).json(message);
  }

  async clearMessages(req: Request, res: Response) {
    const validParams = paramsSchema.safeParse(req.params);
    if (!validParams.success) throw validParams.error;

    await this.service.clearMessages(req.user!.id, validParams.data.id);
    return res.status(204).send();
  }
}
