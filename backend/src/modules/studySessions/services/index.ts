import { StudySessionsRepository } from "../repository/index.js";
import { dashboardStats, subjectStats, weeklySeries } from "./stats.lib.js";

import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import type { TypeCreateStudySessionSchema } from "../schema/createStudySession.schema.js";

export class StudySessionsService {
  private repository: StudySessionsRepository;

  constructor() {
    this.repository = new StudySessionsRepository();
  }

  async create(userId: string, data: TypeCreateStudySessionSchema) {
    try {
      const payload: Prisma.StudySessionCreateInput = {
        duration: data.duration,
        type: data.type,
        user: { connect: { id: userId } },
      };
      if (data.subjectId !== undefined) payload.subjectId = data.subjectId;
      if (data.subjectName !== undefined) payload.subjectName = data.subjectName;
      if (data.completedAt !== undefined) payload.completedAt = new Date(data.completedAt);

      return await this.repository.create(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao registrar sessão de estudo", 500);
    }
  }

  async dashboard(userId: string) {
    const sessions = await this.repository.findAllByUserId(userId);
    return dashboardStats(sessions);
  }

  async weekly(userId: string) {
    const sessions = await this.repository.findAllByUserId(userId);
    return weeklySeries(sessions);
  }

  async subjects(userId: string) {
    const sessions = await this.repository.findAllByUserId(userId);
    return subjectStats(sessions);
  }
}
