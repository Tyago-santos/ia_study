import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { AppError } from "@/shared/error/app-error.js";

const EXPIRES_IN = "1d";

export type TokenPayload = {
  userId: string;
  email: string;
};

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as TokenPayload).userId === "string" &&
    typeof (payload as TokenPayload).email === "string"
  );
}

export class JwtToken {
  createToken(payload: TokenPayload) {
    try {
      return jwt.sign(payload, env.JWT_SECRET, { expiresIn: EXPIRES_IN });
    } catch (error) {
      console.error("Erro ao gerar token", error);
      throw new AppError("Não foi possível gerar o token", 500);
    }
  }

  verifyToken(token: string): TokenPayload {
    let decoded: unknown;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("Token expirado", 401);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Token inválido", 401);
      }

      console.error("Erro ao verificar token", error);
      throw new AppError("Não foi possível validar o token", 500);
    }

    if (!isTokenPayload(decoded)) {
      throw new AppError("Token inválido", 401);
    }

    return decoded;
  }
}

export const jwtToken = new JwtToken();
