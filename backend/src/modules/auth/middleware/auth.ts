import type { NextFunction, Response, Request } from "express";
import { AppError } from "@/shared/error/app-error.js";
import { jwtToken } from "../libs/jwt.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accesToken;

  if (!token) {
    throw new AppError("Token inválido", 401);
  }

  const payload = jwtToken.verifyToken(token);
  req.user = { id: payload.userId, email: payload.email };

  next();
};
