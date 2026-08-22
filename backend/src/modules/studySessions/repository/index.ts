import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class StudySessionsRepository {
  async findAllByUserId(userId: string) {
    return await prisma.studySession.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
    });
  }

  async create(data: Prisma.StudySessionCreateInput) {
    return await prisma.studySession.create({ data });
  }
}
