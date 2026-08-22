import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class SubjectsRepository {
  async findAllByUserId(userId: string) {
    return await prisma.subject.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.subject.findFirst({ where: { id, userId } });
  }

  async create(data: Prisma.SubjectCreateInput) {
    return await prisma.subject.create({ data });
  }

  async delete(userId: string, id: string) {
    const subject = await prisma.subject.findFirst({ where: { id, userId } });
    if (!subject) return null;

    return await prisma.subject.delete({ where: { id: subject.id } });
  }
}
