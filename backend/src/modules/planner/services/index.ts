import { PlannerRepository } from "../repository/index.js";

import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import type {
  TypeCreatePlanBlockSchema,
  TypeUpdatePlanBlockSchema,
} from "../schema/planner.schema.js";

export class PlannerService {
  private repository: PlannerRepository;

  constructor() {
    this.repository = new PlannerRepository();
  }

  /** Blocos e meta juntos: e' o que a tela precisa para desenhar a semana. */
  async getWeek(userId: string) {
    try {
      const [blocks, weeklyGoalMinutes] = await Promise.all([
        this.repository.findAllByUserId(userId),
        this.repository.getWeeklyGoal(userId),
      ]);

      return { blocks, weeklyGoalMinutes };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar o planejamento da semana", 500);
    }
  }

  async createBlock(userId: string, data: TypeCreatePlanBlockSchema) {
    try {
      const payload: Prisma.PlanBlockCreateInput = {
        weekday: data.weekday,
        subjectName: data.subjectName,
        subjectColor: data.subjectColor,
        duration: data.duration,
        user: { connect: { id: userId } },
      };

      // A materia e' opcional: um bloco de uma materia ja apagada continua
      // valendo, so' perde o vinculo.
      if (data.subjectId !== undefined) payload.subject = { connect: { id: data.subjectId } };
      if (data.startTime !== undefined) payload.startTime = data.startTime;
      if (data.topicId !== undefined) payload.topicId = data.topicId;
      if (data.topicName !== undefined) payload.topicName = data.topicName;

      return await this.repository.create(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar o bloco de estudo", 500);
    }
  }

  /** Serve tanto para arrastar de dia (`weekday`) quanto para editar duracao/horario. */
  async updateBlock(userId: string, id: string, data: TypeUpdatePlanBlockSchema) {
    try {
      const payload: Prisma.PlanBlockUpdateInput = {};
      if (data.weekday !== undefined) payload.weekday = data.weekday;
      if (data.duration !== undefined) payload.duration = data.duration;
      if (data.startTime !== undefined) payload.startTime = data.startTime;
      if (data.topicId !== undefined) payload.topicId = data.topicId;
      if (data.topicName !== undefined) payload.topicName = data.topicName;

      const block = await this.repository.update(userId, id, payload);
      if (!block) throw new AppError("Bloco não encontrado", 404);

      return block;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar o bloco de estudo", 500);
    }
  }

  async deleteBlock(userId: string, id: string) {
    try {
      const block = await this.repository.delete(userId, id);
      if (!block) throw new AppError("Bloco não encontrado", 404);
      return block;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao remover o bloco de estudo", 500);
    }
  }

  async setWeeklyGoal(userId: string, minutes: number) {
    try {
      const weeklyGoalMinutes = await this.repository.setWeeklyGoal(userId, minutes);
      return { weeklyGoalMinutes };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao salvar a meta da semana", 500);
    }
  }
}
