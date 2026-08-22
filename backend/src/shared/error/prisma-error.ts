import { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "./app-error.js";

type PrismaErrorMessages = {
  notFound?: string;
  conflict?: string;
};

export function mapPrismaError(
  error: unknown,
  messages: PrismaErrorMessages = {},
): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return new AppError(messages.notFound ?? "Registro não encontrado", 404);
    }

    if (error.code === "P2003" || error.code === "P2039") {
      return new AppError(
        messages.conflict ?? "Operação não pode ser concluída porque existem registros vinculados",
        409,
      );
    }
  }

  return new AppError("Erro interno do servidor", 500);
}
