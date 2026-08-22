import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class ResumeRepository {
  async findAllByUserId(userId: string) {
    return await prisma.resume.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.resume.findFirst({
      where: { id, userId },
    });
  }

  async updateResume(
    userId: string,
    id: string,
    data: Prisma.ResumeUpdateInput,
  ) {
    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) return null;

    return await prisma.resume.update({
      where: { id: resume.id },
      data,
    });
  }

  async deleteResume(userId: string, id: string) {
    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) return null;

    return await prisma.resume.delete({
      where: { id: resume.id },
    });
  }

  async createResume(data: Prisma.ResumeCreateInput) {
    return await prisma.resume.create({
      data,
    });
  }
}
