import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class QuizRepository {
  async findAllByUserId(userId: string, subjectId?: string) {
    return await prisma.quiz.findMany({
      where: { userId, ...(subjectId ? { subjectId } : {}) },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.quiz.findFirst({ where: { id, userId } });
  }

  async create(data: Prisma.QuizCreateInput) {
    return await prisma.quiz.create({ data });
  }

  /** Total criado, quantos ja foram respondidos e a media das notas. */
  async stats(userId: string) {
    const [total, completed] = await Promise.all([
      prisma.quiz.count({ where: { userId } }),
      prisma.quiz.aggregate({
        where: { userId, score: { not: null } },
        _count: { _all: true },
        _avg: { score: true },
      }),
    ]);

    return {
      total,
      completed: completed._count._all,
      average: Math.round(completed._avg.score ?? 0),
    };
  }

  async submit(userId: string, id: string, questions: unknown, score: number) {
    return await prisma.quiz.update({
      where: { id },
      data: {
        questions: questions as Prisma.InputJsonValue,
        score,
        completedAt: new Date(),
      },
    });
  }

  async delete(userId: string, id: string) {
    const quiz = await this.findById(userId, id);
    if (!quiz) return null;

    return await prisma.quiz.delete({ where: { id: quiz.id } });
  }
}
