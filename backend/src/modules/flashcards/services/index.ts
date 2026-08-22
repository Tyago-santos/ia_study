import { FlashcardsRepository } from "../repository/index.js";

import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import type { TypeCreateFlashcardSchema } from "../schema/createFlashcard.schema.js";

export class FlashcardsService {
  private repository: FlashcardsRepository;

  constructor() {
    this.repository = new FlashcardsRepository();
  }

  async getAll(userId: string, subjectId?: string) {
    try {
      return await this.repository.findAllByUserId(userId, subjectId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar flashcards", 500);
    }
  }

  async create(userId: string, data: TypeCreateFlashcardSchema) {
    try {
      const subject = await prisma.subject.findFirst({
        where: { id: data.subjectId, userId },
      });
      if (!subject) throw new AppError("Matéria não encontrada", 404);

      const payload: Prisma.FlashcardCreateInput = {
        front: data.front,
        back: data.back,
        difficulty: data.difficulty,
        user: { connect: { id: userId } },
        subject: { connect: { id: data.subjectId } },
      };

      return await this.repository.create(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar flashcard", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const flashcard = await this.repository.delete(userId, id);
      if (!flashcard) throw new AppError("Flashcard não encontrado", 404);
      return flashcard;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar flashcard", 500);
    }
  }

  async stats(userId: string) {
    try {
      const total = await this.repository.countByUserId(userId);
      return { total };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar estatísticas de flashcards", 500);
    }
  }
}
