import { styled } from '@/shared/styles'

/* A busca abre a lista: precisa parecer uma superfície do app, nao um campo
   solto — por isso raio de painel e o mesmo halo indigo dos cards. */
export const SearchBox = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const SearchInput = styled.TextInput`
  outline-style: none;
  flex: 1;
  padding-vertical: ${({ theme }) => theme.spacing.sm + 4}px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`

/* Mesmo tratamento do label de input compartilhado:13/600 com tracking leve,
   secundário — o olho lê como rotulo, nao como conteúdo. */
export const ColorLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const ColorRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

/* O anel sempre tem a mesma espessura (2px) para as bolhas nao mudarem de
   tamanho; o que muda e' o halo, que so' acende na cor escolhida — e' o unico
   feedback de "selecionado" no modal. */
export const ColorDot = styled.Pressable<{ $color: string; $selected: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 2px;
  background-color: ${({ $color }) => $color};
  border-color: ${({ theme, $color, $selected }) =>
    $selected ? theme.colors.text : `${$color}55`};

  shadow-color: ${({ $color }) => $color};
  shadow-offset: 0px 3px;
  shadow-opacity: ${({ $selected }) => ($selected ? 0.35 : 0)};
  shadow-radius: 8px;
  elevation: ${({ $selected }) => ($selected ? 3 : 0)};
`
