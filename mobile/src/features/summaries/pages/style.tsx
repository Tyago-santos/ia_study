import { styled } from '@/shared/styles'

export const List = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

/* Rotulo igual ao do input compartilhado (13/600 + tracking), secundário —
   o olho distingue rotulo de campo sem precisar de caixa alta. */
export const FieldLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------------ Editor de resumo ------------------------------ */

export const EditorHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
`

/* Titulo grande da tela de escrita:24 com tracking negativo, o mesmo aperto
   do PageHeader — sem isso o 24 pesado parece "fofo" em vez de solido. */
export const EditorTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.6px;
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

/* Altura generosa: e a tela dedicada de escrita, sobra espaco de proposito.
   O bloco de texto e tratado como painel (raio 16, halo indigo) e nao como um
   retangulo de borda cinza — e' a superficie principal da tela. Editar e
   Visualizar usam a mesma geometria para a troca de modo nao dar pulo. */
export const EditorInput = styled.TextInput`
  outline-style: none;
  min-height: 360px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  font-size: 15px;
  line-height: 21px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const EditorPreview = styled.View`
  min-height: 360px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const EditorFooter = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`
