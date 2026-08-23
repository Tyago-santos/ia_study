import { flashcardsService } from '@/features/flashcards/services/flashcards.service'
import { subjectsService } from '@/features/library/services/subjects.service'
import { topicsService } from '@/features/library/services/topics.service'
import { mindmapsService } from '@/features/mindmaps/services/mindmaps.service'
import { quizService } from '@/features/quiz/services/quiz.service'
import { summariesService } from '@/features/summaries/services/summaries.service'

export const searchService = {
  /**
   * Uma unica chamada para tudo que a busca global cobre. Fica sob a sua propria
   * chave de cache em vez de reaproveitar a das paginas: as paginas pedem
   * recortes (por matéria, paginados) e a busca precisa do conjunto completo.
   */
  getDataset: async () => {
    const [subjects, topics, summaries, flashcards, quizzes, mindmaps] = await Promise.all([
      subjectsService.getAll(),
      topicsService.getAll(),
      summariesService.getAll(),
      flashcardsService.getAll(),
      quizService.getAll(),
      mindmapsService.getAll(),
    ])

    return { subjects, topics, summaries, flashcards: flashcards.flashcards, quizzes, mindmaps }
  },
}
