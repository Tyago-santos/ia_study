import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GeminiError, isGeminiConfigured } from '@/features/ai/libs/gemini/gemini.client'
import { queryKeys } from '@/shared/constants/queryKeys'
import { GENERATION_LABELS } from '@/features/ai/libs/generation.labels'
import { generateArtifact } from '@/features/ai/services/generation.service'
import type { GenerationKind } from '@/features/ai/schemas/generation.schema'
import { subjectsService, topicsService } from '@/shared/services/dataStore'
import { alertUser } from '@/shared/services/notifications'
import type { Subject } from '@/shared/types'

/**
 * Geracao de um artefato de estudo pela tela que o exibe.
 *
 * O hook tambem carrega materias e assuntos porque toda geracao precisa desse
 * contexto — sem ele o modelo nao sabe sobre o que escrever, e cada tela teria
 * de repetir as duas consultas so' para alimentar o botao.
 */

const FAILURE = 'Nao consegui gerar o material agora. Tente novamente.'

/** O que cada tipo suja no cache. A timeline do dashboard entra junto. */
const AFFECTED_KEYS: Record<GenerationKind, readonly (readonly string[])[]> = {
  summary: [queryKeys.summaries.all, queryKeys.stats.all],
  flashcards: [queryKeys.flashcards.all, queryKeys.stats.all],
  mindMap: [queryKeys.mindmaps.all],
  quiz: [queryKeys.quiz.all, queryKeys.stats.all],
}

export function useAiGeneration(kind: GenerationKind) {
  const queryClient = useQueryClient()
  const label = GENERATION_LABELS[kind]

  const { data: subjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })
  const { data: topics } = useQuery({
    queryKey: queryKeys.topics.list(),
    queryFn: topicsService.list,
  })
  const { data: configured = true } = useQuery({
    queryKey: queryKeys.ai.status(),
    queryFn: isGeminiConfigured,
    staleTime: 5 * 60 * 1000,
  })

  const generate = useMutation({
    mutationFn: (subject: Subject) =>
      generateArtifact(kind, {
        subject,
        topics: (topics ?? []).filter((topic) => topic.subjectId === subject.id),
      }),

    onSuccess: (message, subject) => {
      for (const key of AFFECTED_KEYS[kind]) {
        queryClient.invalidateQueries({ queryKey: key })
      }

      alertUser({
        title: `${label.noun} de ${subject.name}`,
        message,
        kind: 'success',
        // A geracao passa de meio minuto: e provavel que o app ja esteja em
        // segundo plano quando terminar, e so o banner interno passaria batido.
        system: true,
      })
    },

    onError: (cause, subject) => {
      alertUser({
        title: `Falhou ao gerar ${label.noun.toLowerCase()} de ${subject.name}`,
        message: cause instanceof GeminiError ? cause.message : FAILURE,
        kind: 'error',
      })
    },
  })

  return {
    label,
    subjects: subjects ?? [],
    isConfigured: configured,
    isGenerating: generate.isPending,
    generate: (subject: Subject) => {
      if (generate.isPending) return
      generate.mutate(subject)
    },
  }
}
