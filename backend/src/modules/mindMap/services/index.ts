import { MindMapsRepository } from "../repository/index.js";

import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import { mapPrismaError } from "@/shared/error/prisma-error.js";
import type { TypeUpdateMindMapSchema } from "../schema/updateMindMap.schema.js";
import type { TypeCreateMindMapSchema } from "../schema/createMindMap.schema.js";

export class MindMapsService {
  private repository: MindMapsRepository;

  constructor() {
    this.repository = new MindMapsRepository();
  }

  async getAll(userId: string) {
    try {
      return await this.repository.findAllByUserId(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar mapas mentais", 500);
    }
  }

  async getById(userId: string, id: string) {
    try {
      const mindMap = await this.repository.findById(userId, id);
      if (!mindMap) throw new AppError("Mapa mental não encontrado", 404);
      return mindMap;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar mapa mental", 500);
    }
  }

  async create(userId: string, data: TypeCreateMindMapSchema) {
    try {
      const payload: Prisma.MindMapCreateInput = {
        title: data.title,
        user: { connect: { id: userId } },
        subject: { connect: { id: data.subjectId } },
      };
      if (data.description !== undefined) payload.description = data.description;

      return await this.repository.createMindMap(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapPrismaError(error, {
        notFound: "Matéria não encontrada",
      });
    }
  }

  async update(userId: string, id: string, data: TypeUpdateMindMapSchema) {
    try {
      const payload: Prisma.MindMapUpdateInput = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.description !== undefined) payload.description = data.description;

      const mindMap = await this.repository.updateMinMaps(userId, id, payload);

      if (!mindMap) throw new AppError("Mapa mental não encontrado", 404);

      return mindMap;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar mapa mental", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const mindMap = await this.repository.deleteMindMap(userId, id);

      if (!mindMap) throw new AppError("Mapa mental não encontrado", 404);

      return mindMap;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar mapa mental", 500);
    }
  }
}
