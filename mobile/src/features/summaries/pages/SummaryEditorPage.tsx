import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { MarkdownText } from '@/features/ai/components/MarkdownText'
import { Button } from '@/shared/components/ui/Button'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { Input } from '@/shared/components/ui/Input'
import { Screen } from '@/shared/components/ui/Screen'
import { useTheme } from '@/shared/hooks/useTheme'
import type { Subject } from '@/shared/types'
import { isDraftValid } from '../services/summaries.service'
import * as S from './style'

const MARKDOWN_HINT =
  '# Título\n\n**negrito**, `código`, - item de lista\n\nEscreva seu resumo aqui...'

interface SummaryEditorPageProps {
  subjects: Subject[]
  defaultSubjectId: string | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (draft: { title: string; content: string; subjectId: string }) => void
}

/** Tela cheia pra escrever um resumo em markdown, com pre-visualizacao — troca
 * o antigo modal pequeno por espaco de sobra pra digitar um texto longo. */
export function SummaryEditorPage({
  subjects,
  defaultSubjectId,
  isSubmitting,
  onClose,
  onSubmit,
}: SummaryEditorPageProps) {
  const { colors } = useTheme()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subjectId, setSubjectId] = useState<string | null>(defaultSubjectId)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  const draft = { title, content, subjectId }
  const canSubmit = isDraftValid(draft) && !!subjectId

  return (
    <Screen scroll>
      <S.EditorHeader>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <S.EditorTitle>Novo resumo</S.EditorTitle>
        <S.EditorHeaderSpacer />
      </S.EditorHeader>

      <S.FieldLabel>Matéria</S.FieldLabel>
      <FilterChips
        value={subjectId}
        onChange={setSubjectId}
        options={subjects.map((s) => ({ value: s.id, label: s.name, color: s.color }))}
      />

      <Input
        label="Título"
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Leis de Newton"
        style={{ marginTop: 16 }}
      />

      <S.EditorToggleRow>
        <S.FieldLabel>Conteúdo</S.FieldLabel>
        <FilterChips
          value={mode}
          onChange={(value) => setMode((value as typeof mode) ?? 'edit')}
          options={[
            { value: 'edit', label: 'Editar' },
            { value: 'preview', label: 'Visualizar' },
          ]}
        />
      </S.EditorToggleRow>

      {mode === 'edit' ? (
        <S.EditorInput
          value={content}
          onChangeText={setContent}
          placeholder={MARKDOWN_HINT}
          placeholderTextColor={colors.textSecondary}
          multiline
          textAlignVertical="top"
          autoCapitalize="sentences"
        />
      ) : (
        <S.EditorPreview>
          {content.trim() ? (
            <MarkdownText content={content} />
          ) : (
            <EmptyState
              icon="eye-outline"
              title="Nada pra mostrar ainda"
              description="Escreva na aba Editar pra ver a pré-visualização aqui."
            />
          )}
        </S.EditorPreview>
      )}

      <S.EditorFooter>
        <Button
          title="Salvar resumo"
          onPress={() => subjectId && onSubmit({ title: title.trim(), content: content.trim(), subjectId })}
          loading={isSubmitting}
          disabled={!canSubmit}
        />
      </S.EditorFooter>
    </Screen>
  )
}
