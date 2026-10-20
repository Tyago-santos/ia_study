import { styled } from '@/shared/styles'

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const TitleBlock = styled.View`
  flex: 1;
  gap: 2px;
`

/** Titulo de tela com tracking negativo: mesmo recurso do display do Stitch,
 *  que aperta o espaco entre letras pra ganhar peso sem aumentar corpo. */
export const Title = styled.Text`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.7px;
  color: ${({ theme }) => theme.colors.text};
`

export const Subtitle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/** Acao da tela vira pill (radius full) com halo, que e' a geometria que o
 *  Stitch reserva para tudo que e' modular/recompensa. */
export const Action = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.accent};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 5px;
  shadow-opacity: 0.35;
  shadow-radius: 12px;
  elevation: 4;
`

export const ActionLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.onAccent};
`
