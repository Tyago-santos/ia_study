import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class PlannerRepository {
  async findAllByUserId(userId: string) {
    return await prisma.planBlock.findMany({
      where: { userId },
      orderBy: [{ weekday: "asc" }, { createdAt: "asc" }],
    });
  }

  async create(data: Prisma.PlanBlockCreateInput) {
    return await prisma.planBlock.create({ data });
  }

  async update(userId: string, id: string, data: Prisma.PlanBlockUpdateInput) {
    const block = await prisma.planBlock.findFirst({ where: { id, userId } });
    if (!block) return null;

    return await prisma.planBlock.update({ where: { id: block.id }, data });
  }

  async delete(userId: string, id: string) {
    const block = await prisma.planBlock.findFirst({ where: { id, userId } });
    if (!block) return null;

    return await prisma.planBlock.delete({ where: { id: block.id } });
  }

  async getWeeklyGoal(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { weeklyGoalMinutes: true },
    });
    return user?.weeklyGoalMinutes ?? 0;
  }

  async setWeeklyGoal(userId: string, weeklyGoalMinutes: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { weeklyGoalMinutes },
      select: { weeklyGoalMinutes: true },
    });
    return user.weeklyGoalMinutes;
  }
}
