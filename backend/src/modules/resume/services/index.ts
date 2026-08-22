import { ResumeRepository } from "../repository/index.js";

import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import type { TypeUpdateResumeSchema } from "../schema/updateResume.schema.js";
import type { TypeCreateResumeSchema } from "../schema/createResume.schema.js";

export class ResumeService {
  private repository: ResumeRepository;

  constructor() {
    this.repository = new ResumeRepository();
  }

  async getAll(userId: string) {
    try {
      return await this.repository.findAllByUserId(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar resumos", 500);
    }
  }

  async getById(userId: string, id: string) {
    try {
      const resume = await this.repository.findById(userId, id);
      if (!resume) throw new AppError("Resumo não encontrado", 404);
      return resume;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar resumo", 500);
    }
  }

  async create(userId: string, data: TypeCreateResumeSchema) {
    try {
      return await this.repository.createResume({
        ...data,
        user: { connect: { id: userId } },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar resumo", 500);
    }
  }

  async update(userId: string, id: string, data: TypeUpdateResumeSchema) {
    try {
      const payload: Prisma.ResumeUpdateInput = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.content !== undefined) payload.content = data.content;

      const resume = await this.repository.updateResume(userId, id, payload);

      if (!resume) throw new AppError("Resumo não encontrado", 404);

      return resume;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar resumo", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const resume = await this.repository.deleteResume(userId, id);

      if (!resume) throw new AppError("Resumo não encontrado", 404);

      return resume;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar resumo", 500);
    }
  }
}
