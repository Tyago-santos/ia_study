import { ConversationRepository } from "../repository/index.js";

import { AppError } from "@/shared/error/app-error.js";
import type { TypeCreateMessageSchema } from "../schema/conversation.schema.js";

const TITLE_LIMIT = 40;

/** Titulo curto o bastante para caber numa linha da lista de conversas. */
function titleFrom(content: string): string {
  const clean = content.trim().replace(/\s+/g, " ");
  return clean.length > TITLE_LIMIT ? `${clean.slice(0, TITLE_LIMIT).trimEnd()}...` : clean;
}

export class ConversationService {
  private repository: ConversationRepository;

  constructor() {
    this.repository = new ConversationRepository();
  }

  async getAll(userId: string) {
    try {
      return await this.repository.findAllByUserId(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar as conversas", 500);
    }
  }

  async create(userId: string, title?: string) {
    try {
      return await this.repository.create({
        title: title ?? "Nova conversa",
        user: { connect: { id: userId } },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar a conversa", 500);
    }
  }

  async rename(userId: string, id: string, title: string) {
    try {
      const conversation = await this.repository.findById(userId, id);
      if (!conversation) throw new AppError("Conversa não encontrada", 404);

      return await this.repository.touch(id, title);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao renomear a conversa", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const conversation = await this.repository.delete(userId, id);
      if (!conversation) throw new AppError("Conversa não encontrada", 404);
      return conversation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao remover a conversa", 500);
    }
  }

  async listMessages(userId: string, id: string) {
    try {
      const conversation = await this.repository.findById(userId, id);
      if (!conversation) throw new AppError("Conversa não encontrada", 404);

      return await this.repository.findMessages(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar as mensagens", 500);
    }
  }

  /**
   * A primeira pergunta da conversa tambem vira o titulo, que ate entao era
   * "Nova conversa" — mesma regra usada pelo app quando o chat ainda gravava
   * so' localmente.
   */
  async addMessage(userId: string, id: string, data: TypeCreateMessageSchema) {
    try {
      const conversation = await this.repository.findById(userId, id);
      if (!conversation) throw new AppError("Conversa não encontrada", 404);

      const count = await this.repository.countMessages(id);
      const message = await this.repository.createMessage(id, data.role, data.content);

      const isFirstQuestion = data.role === "user" && count === 0;
      await this.repository.touch(id, isFirstQuestion ? titleFrom(data.content) : undefined);

      return message;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao gravar a mensagem", 500);
    }
  }

  async clearMessages(userId: string, id: string) {
    try {
      const conversation = await this.repository.findById(userId, id);
      if (!conversation) throw new AppError("Conversa não encontrada", 404);

      await this.repository.clearMessages(id);
      await this.repository.touch(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao limpar a conversa", 500);
    }
  }
}
