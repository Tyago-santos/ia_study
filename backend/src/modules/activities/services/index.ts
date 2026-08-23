import { ActivitiesRepository } from "../repository/index.js";
import { AppError } from "@/shared/error/app-error.js";

export type ActivityType = "pomodoro" | "quiz" | "flashcard" | "summary";

export interface ActivityView {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  subjectId: string | null;
  createdAt: Date;
}

const DEFAULT_LIMIT = 20;

export class ActivitiesService {
  private repository: ActivitiesRepository;

  constructor() {
    this.repository = new ActivitiesRepository();
  }

  async recent(userId: string, limit = DEFAULT_LIMIT) {
    try {
      const [sessions, quizzes, flashcards, resumes] = await Promise.all([
        this.repository.recentStudySessions(userId, limit),
        this.repository.recentQuizzes(userId, limit),
        this.repository.recentFlashcards(userId, limit),
        this.repository.recentResumes(userId, limit),
      ]);

      const activities: ActivityView[] = [
        ...sessions.map(
          (session): ActivityView => ({
            id: session.id,
            type: "pomodoro",
            title: `Sessão de ${session.subjectName ?? "estudo"}`,
            description: `${session.duration} min - ${session.subjectName ?? "Estudo livre"}`,
            subjectId: session.subjectId,
            createdAt: session.completedAt,
          }),
        ),
        ...quizzes.map(
          (quiz): ActivityView => ({
            id: quiz.id,
            type: "quiz",
            title: quiz.title,
            description: `Score: ${quiz.score}%`,
            subjectId: quiz.subjectId,
            // filtrado por completedAt != null na query, seguro dar unwrap aqui.
            createdAt: quiz.completedAt!,
          }),
        ),
        ...flashcards.map(
          (card): ActivityView => ({
            id: card.id,
            type: "flashcard",
            title: "Flashcard criado",
            description: card.front,
            subjectId: card.subjectId,
            createdAt: card.createdAt,
          }),
        ),
        ...resumes.map(
          (resume): ActivityView => ({
            id: resume.id,
            type: "summary",
            title: resume.name,
            description: "Resumo criado",
            subjectId: null,
            createdAt: resume.createdAt,
          }),
        ),
      ];

      return activities
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar atividades recentes", 500);
    }
  }
}
