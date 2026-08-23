import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/constants/queryKeys'
import { searchService } from '@/features/search/services/search.service'

/**
 * Carrega o conjunto pesquisavel — e so quando alguem abre a busca. O header
 * existe em todas as rotas; buscar tudo no boot do app custaria seis requisicoes
 * por navegacao para um painel que na maioria das sessoes nunca abre.
 *
 * Sem `staleTime`: cada abertura recarrega. Mostrar na busca um resumo que ja
 * foi apagado é pior que esperar mais um instante.
 */
export function useSearchDataset(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.search.dataset(),
    queryFn: searchService.getDataset,
    enabled,
  })
}
