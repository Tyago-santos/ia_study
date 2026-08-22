import { UserRepository } from "../repository/index.js";

import { Bcrypt } from "@modules/auth/libs/bcrypt.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import { mapPrismaError } from "@/shared/error/prisma-error.js";
import type { TypeCreateUserSchema } from "../schema/createUser.schema.js";
import type { TypeUpdateUserSchema } from "../schema/updateUser.schema.js";

export class UserService {
  private repository: UserRepository;
  private encrypt: Bcrypt;

  constructor() {
    this.repository = new UserRepository();
    this.encrypt = new Bcrypt();
  }

  getUser = async (id: string) => {
    return await this.repository.getUser(id);
  };

  updateUser = async (id: string, data: TypeUpdateUserSchema) => {
    const payload: Prisma.UserUpdateInput = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.email !== undefined) payload.email = data.email;
    if (data.password !== undefined) {
      payload.password = await this.encrypt.encryptPassword(data.password);
    }

    return await this.repository.updateUser(id, payload);
  };

  createUser = async (data: TypeCreateUserSchema) => {
    const password = await this.encrypt.encryptPassword(data.password);
    return await this.repository.createUser({ ...data, password });
  };

  deleteUser = async (id: string) => {
    try {
      return await this.repository.deleteUser(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapPrismaError(error, {
        notFound: "Usuário não encontrado",
        conflict: "Não é possível excluir o usuário porque existem registros vinculados a ele",
      });
    }
  };
}
