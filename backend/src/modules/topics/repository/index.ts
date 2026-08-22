import { prisma } from "@/config/prisma.js";

export class TopicsRepository {
  async findAllByUserId(userId: string) {
    return await prisma.topic.findMany({
      where: { subject: { userId } },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.topic.findFirst({ where: { id, subject: { userId } } });
  }

  async create(subjectId: string, name: string) {
    return await prisma.topic.create({ data: { subjectId, name } });
  }

  async toggle(userId: string, id: string) {
    const topic = await this.findById(userId, id);
    if (!topic) return null;

    return await prisma.topic.update({
      where: { id: topic.id },
      data: { completed: !topic.completed },
    });
  }

  async delete(userId: string, id: string) {
    const topic = await this.findById(userId, id);
    if (!topic) return null;

    return await prisma.topic.delete({ where: { id: topic.id } });
  }
}
