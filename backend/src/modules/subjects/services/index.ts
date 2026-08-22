import { SubjectsRepository } from "../repository/index.js";

import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import { mapPrismaError } from "@/shared/error/prisma-error.js";
import type { TypeCreateSubjectSchema } from "../schema/createSubject.schema.js";

export class SubjectsService {
  private repository: SubjectsRepository;

  constructor() {
    this.repository = new SubjectsRepository();
  }

  async getAll(userId: string) {
    try {
      return await this.repository.findAllByUserId(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar matérias", 500);
    }
  }

  async create(userId: string, data: TypeCreateSubjectSchema) {
    try {
      const payload: Prisma.SubjectCreateInput = {
        name: data.name,
        color: data.color,
        user: { connect: { id: userId } },
      };
      if (data.icon !== undefined) payload.icon = data.icon;

      return await this.repository.create(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar matéria", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const subject = await this.repository.delete(userId, id);
      if (!subject) throw new AppError("Matéria não encontrada", 404);
      return subject;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapPrismaError(error, {
        notFound: "Matéria não encontrada",
        conflict: "Não é possível excluir: existem flashcards, quizzes ou mapas mentais vinculados a essa matéria",
      });
    }
  }
}
