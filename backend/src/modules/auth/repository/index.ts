import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class AuthRepository {
  async finByEmailUser(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(user: Prisma.UserCreateInput) {
    return await prisma.user.create({ data: user });
  }

  async updateLastLogin(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
