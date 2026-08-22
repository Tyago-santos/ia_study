import { SchoolSubjects } from "../repository/index.js";

import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import type { TypeCreateSchoolSubjectSchema } from "../schema/createSchoolSubject.schema.js";
import type { TypeUpdateSchoolSubjectSchema } from "../schema/updateSchoolSubject.schema.js";

export class SchoolSubjectsService {
  private repository: SchoolSubjects;

  constructor() {
    this.repository = new SchoolSubjects();
  }

  async getAll(userId: string) {
    try {
      return await this.repository.finBySchoolSubjectsAll(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar matérias", 500);
    }
  }

  async getById(userId: string, id: string) {
    try {
      const subject = await this.repository.findById(userId, id);
      if (!subject) throw new AppError("Matéria não encontrada", 404);
      return subject;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar matéria", 500);
    }
  }

  async create(userId: string, data: TypeCreateSchoolSubjectSchema) {
    try {
      const payload: Prisma.SchoolSubjectCreateInput = {
        name: data.name,
        answer: data.answer,
        response: data.response,
        user: { connect: { id: userId } },
      };

      return await this.repository.createSchoolSubjects(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar matéria", 500);
    }
  }

  async update(userId: string, id: string, data: TypeUpdateSchoolSubjectSchema) {
    try {
      const payload: Prisma.SchoolSubjectUpdateInput = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.answer !== undefined) payload.answer = data.answer;
      if (data.response !== undefined) payload.response = data.response;

      const subject = await this.repository.updateSchoolSubjects(userId, id, payload);

      if (!subject) throw new AppError("Matéria não encontrada", 404);

      return subject;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar matéria", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const subject = await this.repository.deleteSchoolSubjects(userId, id);

      if (!subject) throw new AppError("Matéria não encontrada", 404);

      return subject;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar matéria", 500);
    }
  }
}
