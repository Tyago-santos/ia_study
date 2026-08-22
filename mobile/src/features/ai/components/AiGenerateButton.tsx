import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { FormModal } from '@/shared/components/ui/FormModal'
import { useTheme } from '@/shared/hooks/useTheme'
import { useAiGeneration } from '../hooks/useAiGeneration'
import type { GenerationKind } from '../schemas/generation.schema'
import * as S from './style'

/**
 * Botao de gerar com IA, um por tela.
 *
 * Antes de gerar ele pergunta a materia, porque todo material nasce preso a uma
 * (e o modelo precisa dela como contexto). A escolha vive num modal em vez de
 * seguir o filtro da tela: nem toda tela tem filtro, e "Todas" nao serve de
 * contexto.
 */
export function AiGenerateButton({ kind }: { kind: GenerationKind }) {
  const { colors } = useTheme()
  const { label, subjects, isConfigured, isGenerating, generate } = useAiGeneration(kind)

  const [picking, setPicking] = useState(false)
  const [subjectId, setSubjectId] = useState<string | null>(null)

  const blocked = !isConfigured || subjects.length === 0
  const disabled = blocked || isGenerating

  const open = () => {
    setSubjectId(subjects[0]?.id ?? null)
    setPicking(true)
  }

  const confirm = () => {
    const subject = subjects.find((item) => item.id === subjectId)
    if (!subject) return

    setPicking(false)
    generate(subject)
  }

  return (
    <>
      <S.GenerateButton onPress={open} disabled={disabled} $disabled={disabled}>
        {isGenerating ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Ionicons name={label.icon} size={18} color={colors.accentText} />
        )}

        <S.GenerateText>
          <S.GenerateTitle>{isGenerating ? 'Gerando...' : label.action}</S.GenerateTitle>
          <S.GenerateHint>
            {hintFor(label.hint, {
              isGenerating,
              isConfigured,
              hasSubjects: subjects.length > 0,
            })}
          </S.GenerateHint>
        </S.GenerateText>
      </S.GenerateButton>

      <FormModal
        open={picking}
        title={label.action}
        onClose={() => setPicking(false)}
        onSubmit={confirm}
        submitLabel="Gerar"
        submitDisabled={!subjectId}
      >
        <S.PickerLabel>Matéria</S.PickerLabel>
        <FilterChips
          value={subjectId}
          onChange={setSubjectId}
          options={subjects.map((subject) => ({
            value: subject.id,
            label: subject.name,
            color: subject.color,
          }))}
        />

        <S.PickerNote>
          A IA usa os assuntos dessa matéria como conteúdo e prioriza os que ainda não foram
          concluídos. Leva cerca de meio minuto — o aviso chega ao terminar.
        </S.PickerNote>
      </FormModal>
    </>
  )
}

/**
 * A linha de apoio do botao. Ela carrega o motivo de estar apagado porque um
 * botao desabilitado sem explicacao parece defeito do app.
 */
function hintFor(
  idle: string,
  state: { isGenerating: boolean; isConfigured: boolean; hasSubjects: boolean },
): string {
  if (state.isGenerating) return 'Pode levar cerca de meio minuto'
  if (!state.isConfigured) return 'IA não configurada no servidor'
  if (!state.hasSubjects) return 'Crie uma matéria na Biblioteca primeiro'

  return idle
}
