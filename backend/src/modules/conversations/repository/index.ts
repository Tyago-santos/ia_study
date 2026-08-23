import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class ConversationRepository {
  async findAllByUserId(userId: string) {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findById(userId: string, id: string) {
    return await prisma.conversation.findFirst({ where: { id, userId } });
  }

  async create(data: Prisma.ConversationCreateInput) {
    return await prisma.conversation.create({ data });
  }

  async touch(id: string, title?: string) {
    const data: Prisma.ConversationUpdateInput = { updatedAt: new Date() };
    if (title !== undefined) data.title = title;
    return await prisma.conversation.update({ where: { id }, data });
  }

  async delete(userId: string, id: string) {
    const conversation = await this.findById(userId, id);
    if (!conversation) return null;

    return await prisma.conversation.delete({ where: { id: conversation.id } });
  }

  async findMessages(conversationId: string) {
    return await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }

  async countMessages(conversationId: string) {
    return await prisma.chatMessage.count({ where: { conversationId } });
  }

  async createMessage(conversationId: string, role: string, content: string) {
    return await prisma.chatMessage.create({ data: { conversationId, role, content } });
  }

  async clearMessages(conversationId: string) {
    await prisma.chatMessage.deleteMany({ where: { conversationId } });
  }
}
