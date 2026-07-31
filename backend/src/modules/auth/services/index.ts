import { loginSchema } from "../schema/login.schema.js";

import { Bcrypt } from "@modules/auth/libs/bcrypt.js";
import { AuthRepository } from "../repository/index.js";

import { JwtToken } from "../libs/jwt.js";
import { AppError } from "@/shared/error/app-error.js";

type TypeUserService = {
  name: string;
  email: string;
  password: string;
};

export class AuthService {
  private encrypt: Bcrypt;
  private repository: AuthRepository;
  private jwt: JwtToken;

  constructor() {
    this.encrypt = new Bcrypt();
    this.repository = new AuthRepository();

    this.jwt = new JwtToken();
  }

  async login(email: string, password: string) {
    try {
      const user = await this.repository.finByEmailUser(email);

      if (!user) throw new AppError("Credenciais inválidas", 401);

      await this.encrypt.verifyPassword(user.password, password);

      const token = this.jwt.createToken({
        userId: user.id,
        email: user.email,
      });

      return {
        token,
        user,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Credenciais inválidas", 401);
    }
  }

  async register({ name, email, password }: TypeUserService) {
    try {
      const userExist = await this.repository.finByEmailUser(email);

      if (userExist) throw new AppError("Email já existe", 400);

      const userPassword = await this.encrypt.encryptPassword(password);

      const user = await this.repository.createUser({
        name,
        password: userPassword,
        email: email,
      });

      const token = this.jwt.createToken({
        userId: user.id,
        email: user.email,
      });

      return {
        token,
        user,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Credenciais inválidas", 401);
    }
  }
}
