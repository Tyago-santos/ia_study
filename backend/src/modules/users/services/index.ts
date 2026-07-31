import { UserRepository } from "../repository/index.js";

import type { TypeParamsSchema } from "../schema/paramsValidate.js";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }
  getUser = async (email: string) => {
    return await this.repository.getUser(email);
  };

  updateUser = async (
    id: TypeParamsSchema["id"],
    data: TypeParamsSchema["data"],
  ) => {
    return await this.repository.updateUser(id, data);
  };

  createUser = async (data: TypeParamsSchema["data"]) => {
    return await this.repository.createUser(data);
  };

  deleteUser = async (id: TypeParamsSchema["id"]) => {
    return await this.repository.deleteUser(id);
  };
}
