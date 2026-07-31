import type { NextFunction, Request, Response } from "express";

import { ZodError, flattenError } from "zod";

import { AppError } from "../error/app-error.js";

export function erroHandle(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({
        message: "Dados inválidos",
        error: flattenError(err).fieldErrors,
      });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.log(err);
  return res.status(500).json({ message: "Erro interno do servidor" });
}
