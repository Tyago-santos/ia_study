import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class MindMapsRepository {
  async findAllByUserId(userId: string) {
    return await prisma.mindMap.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: { nodes: true },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.mindMap.findFirst({
      where: { id, userId },
      include: { nodes: true },
    });
  }

  async updateMinMaps(
    userId: string,
    id: string,
    data: Prisma.MindMapUpdateInput,
  ) {
    const mindMap = await prisma.mindMap.findFirst({
      where: { id, userId },
    });

    if (!mindMap) return null;

    return await prisma.mindMap.update({
      where: { id: mindMap.id },
      data,
    });
  }

  async deleteMindMap(userId: string, id: string) {
    const mindMap = await prisma.mindMap.findFirst({
      where: { id, userId },
    });

    if (!mindMap) return null;

    return await prisma.mindMap.delete({
      where: { id: mindMap.id },
    });
  }

  async createMindMap(data: Prisma.MindMapCreateInput) {
    return await prisma.mindMap.create({
      data,
    });
  }
}
