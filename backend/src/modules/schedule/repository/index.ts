import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class ScheduleRepository {
  async findAllByUserId(userId: string) {
    return await prisma.scheduleEvent.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.scheduleEvent.findFirst({ where: { id, userId } });
  }

  async create(data: Prisma.ScheduleEventCreateInput) {
    return await prisma.scheduleEvent.create({ data });
  }

  async update(userId: string, id: string, data: Prisma.ScheduleEventUpdateInput) {
    const event = await this.findById(userId, id);
    if (!event) return null;

    return await prisma.scheduleEvent.update({ where: { id: event.id }, data });
  }

  async delete(userId: string, id: string) {
    const event = await this.findById(userId, id);
    if (!event) return null;

    return await prisma.scheduleEvent.delete({ where: { id: event.id } });
  }
}
