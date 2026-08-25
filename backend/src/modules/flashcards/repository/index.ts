import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class FlashcardsRepository {
  async findAllByUserId(userId: string, subjectId?: string) {
    return await prisma.flashcard.findMany({
      where: { userId, ...(subjectId ? { subjectId } : {}) },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.FlashcardCreateInput) {
    return await prisma.flashcard.create({ data });
  }

  async delete(userId: string, id: string) {
    const flashcard = await prisma.flashcard.findFirst({ where: { id, userId } });
    if (!flashcard) return null;

    return await prisma.flashcard.delete({ where: { id: flashcard.id } });
  }

  async findById(userId: string, id: string) {
    return await prisma.flashcard.findFirst({ where: { id, userId } });
  }

  async review(id: string, data: { difficulty: string; nextReview: Date }) {
    return await prisma.flashcard.update({
      where: { id },
      data: {
        difficulty: data.difficulty,
        nextReview: data.nextReview,
        reviewCount: { increment: 1 },
      },
    });
  }

  async countByUserId(userId: string) {
    return await prisma.flashcard.count({ where: { userId } });
  }
}
