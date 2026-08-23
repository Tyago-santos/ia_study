import { prisma } from "@/config/prisma.js";

export class ActivitiesRepository {
  async recentStudySessions(userId: string, limit: number) {
    return await prisma.studySession.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: limit,
    });
  }

  async recentQuizzes(userId: string, limit: number) {
    return await prisma.quiz.findMany({
      where: { userId, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: limit,
    });
  }

  async recentFlashcards(userId: string, limit: number) {
    return await prisma.flashcard.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async recentResumes(userId: string, limit: number) {
    return await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
