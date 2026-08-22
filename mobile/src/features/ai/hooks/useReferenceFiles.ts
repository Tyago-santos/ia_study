import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ReferenceFileError, pickReferenceFile } from '@/features/ai/services/reference-files.service'
import { queryKeys } from '@/shared/constants/queryKeys'
import { referenceFilesService } from '@/shared/services/dataStore'

const IMPORT_ERROR = 'Não foi possível importar o arquivo. Tente novamente.'

/** Estado e acoes da tela de Arquivos: a lista que o agente consulta via tool. */
export function useReferenceFiles() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: files, isLoading } = useQuery({
    queryKey: queryKeys.referenceFiles.list(),
    queryFn: referenceFilesService.list,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.referenceFiles.all })

  const add = useMutation({
    mutationFn: pickReferenceFile,
    onMutate: () => setError(null),
    onError: (cause) => {
      setError(cause instanceof ReferenceFileError ? cause.message : IMPORT_ERROR)
    },
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: referenceFilesService.remove,
    onSuccess: invalidate,
  })

  return {
    files: files ?? [],
    isLoading,
    adding: add.isPending,
    error,
    dismissError: () => setError(null),
    addFile: add.mutate,
    removeFile: remove.mutate,
  }
}
