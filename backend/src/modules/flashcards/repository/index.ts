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

  async countByUserId(userId: string) {
    return await prisma.flashcard.count({ where: { userId } });
  }
}
