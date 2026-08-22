import { TopicsRepository } from "../repository/index.js";

import { prisma } from "@/config/prisma.js";
import { AppError } from "@/shared/error/app-error.js";
import type { TypeCreateTopicSchema } from "../schema/createTopic.schema.js";

export class TopicsService {
  private repository: TopicsRepository;

  constructor() {
    this.repository = new TopicsRepository();
  }

  async getAll(userId: string) {
    try {
      return await this.repository.findAllByUserId(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar assuntos", 500);
    }
  }

  async create(userId: string, data: TypeCreateTopicSchema) {
    try {
      const subject = await prisma.subject.findFirst({
        where: { id: data.subjectId, userId },
      });
      if (!subject) throw new AppError("Matéria não encontrada", 404);

      return await this.repository.create(data.subjectId, data.name);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar assunto", 500);
    }
  }

  async toggle(userId: string, id: string) {
    try {
      const topic = await this.repository.toggle(userId, id);
      if (!topic) throw new AppError("Assunto não encontrado", 404);
      return topic;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar assunto", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const topic = await this.repository.delete(userId, id);
      if (!topic) throw new AppError("Assunto não encontrado", 404);
      return topic;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar assunto", 500);
    }
  }
}
