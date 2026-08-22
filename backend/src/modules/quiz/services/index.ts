import { QuizRepository } from "../repository/index.js";

import { prisma } from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { AppError } from "@/shared/error/app-error.js";
import type { TypeCreateQuizSchema, TypeSubmitQuizSchema } from "../schema/createQuiz.schema.js";

type StoredQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
};

export class QuizService {
  private repository: QuizRepository;

  constructor() {
    this.repository = new QuizRepository();
  }

  async getAll(userId: string, subjectId?: string) {
    try {
      return await this.repository.findAllByUserId(userId, subjectId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar quizzes", 500);
    }
  }

  async create(userId: string, data: TypeCreateQuizSchema) {
    try {
      const subject = await prisma.subject.findFirst({
        where: { id: data.subjectId, userId },
      });
      if (!subject) throw new AppError("Matéria não encontrada", 404);

      const payload: Prisma.QuizCreateInput = {
        title: data.title,
        questions: data.questions as unknown as Prisma.InputJsonValue,
        user: { connect: { id: userId } },
        subject: { connect: { id: data.subjectId } },
      };

      return await this.repository.create(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar quiz", 500);
    }
  }

  async submit(userId: string, quizId: string, data: TypeSubmitQuizSchema) {
    try {
      const quiz = await this.repository.findById(userId, quizId);
      if (!quiz) throw new AppError("Quiz não encontrado", 404);
      if (quiz.completedAt) throw new AppError("Quiz já finalizado", 409);

      const questions = quiz.questions as unknown as StoredQuestion[];
      const answered = questions.map((q) => ({
        ...q,
        userAnswer: data.answers[q.id],
      }));
      const correct = answered.filter((q) => q.userAnswer === q.correctAnswer).length;
      const score = Math.round((correct / questions.length) * 100);

      await this.repository.submit(userId, quiz.id, answered, score);

      return { score, correct, total: questions.length };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao finalizar quiz", 500);
    }
  }

  async delete(userId: string, id: string) {
    try {
      const quiz = await this.repository.delete(userId, id);
      if (!quiz) throw new AppError("Quiz não encontrado", 404);
      return quiz;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar quiz", 500);
    }
  }

  async stats(userId: string) {
    try {
      return await this.repository.stats(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar estatísticas de quizzes", 500);
    }
  }
}
