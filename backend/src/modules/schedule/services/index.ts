import { ScheduleRepository } from "../repository/index.js";

import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import type {
  TypeCreateScheduleEventSchema,
  TypeUpdateScheduleEventSchema,
} from "../schema/schedule.schema.js";

export class ScheduleService {
  private repository: ScheduleRepository;

  constructor() {
    this.repository = new ScheduleRepository();
  }

  async getAll(userId: string) {
    try {
      return await this.repository.findAllByUserId(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar o cronograma", 500);
    }
  }

  async create(userId: string, data: TypeCreateScheduleEventSchema) {
    try {
      const payload: Prisma.ScheduleEventCreateInput = {
        title: data.title,
        type: data.type,
        date: new Date(data.date),
        user: { connect: { id: userId } },
      };
      if (data.subjectId !== undefined) payload.subject = { connect: { id: data.subjectId } };
      if (data.durationMinutes !== undefined) payload.durationMinutes = data.durationMinutes;
      if (data.description !== undefined) payload.description = data.description;

      return await this.repository.create(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar o compromisso", 500);
    }
  }

  async update(userId: string, id: string, data: TypeUpdateScheduleEventSchema) {
    try {
      const payload: Prisma.ScheduleEventUpdateInput = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.type !== undefined) payload.type = data.type;
      if (data.date !== undefined) payload.date = new Date(data.date);
      if (data.durationMinutes !== undefined) payload.durationMinutes = data.durationMinutes;
      if (data.description !== undefined) payload.description = data.description;
      if (data.completed !== undefined) payload.completed = data.completed;

      const event = await this.repository.update(userId, id, payload);
      if (!event) throw new AppError("Compromisso não encontrado", 404);

      return event;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar o compromisso", 500);
    }
  }

  /** O app so' manda o id; o servidor inverte o estado que estiver gravado. */
  async toggle(userId: string, id: string) {
    try {
      const current = await this.repository.findById(userId, id);
      if (!current) throw new AppError("Compromisso não encontrado", 404);

      const event = await this.repository.update(userId, id, {
        completed: !current.completed,
      });

      return event!;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar o compromisso", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const event = await this.repository.delete(userId, id);
      if (!event) throw new AppError("Compromisso não encontrado", 404);
      return event;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao remover o compromisso", 500);
    }
  }
}
