import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export class UserRepository {
  createUser = async (data: Prisma.UserCreateInput) => {
    return await prisma.user.create({ data, omit: { password: true } });
  };

  updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
    return await prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });
  };

  deleteUser = async (id: string) => {
    return await prisma.user.delete({
      where: { id },
      omit: { password: true },
    });
  };

  getUser = async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  };
}
