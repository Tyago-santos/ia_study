import { prisma } from "@/config/prisma.js";

export class UserRepository {
  createUser = async (data: any) => {
    return await prisma.user.create({ data, omit: { password: true } });
  };

  updateUser = async (id: string, data: any) => {
    return await prisma.user.update({
      where: {
        id,
      },
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
