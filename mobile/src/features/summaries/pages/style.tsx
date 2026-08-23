import { styled } from '@/shared/styles'

export const List = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const FieldLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------------ Editor de resumo ------------------------------ */

export const EditorHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
`

export const EditorTitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

/* Equilibra a seta de voltar pra o titulo ficar centralizado. */
export const EditorHeaderSpacer = styled.View`
  width: 22px;
`

export const EditorToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`

/* Altura generosa: e a tela dedicada de escrita, sobra espaco de proposito. */
export const EditorInput = styled.TextInput`
  outline-style: none;
  min-height: 360px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  font-size: 15px;
  line-height: 21px;
  color: ${({ theme }) => theme.colors.text};
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
`

export const EditorPreview = styled.View`
  min-height: 360px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
`

export const EditorFooter = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`
