import { styled } from '@/shared/styles'

export const Container = styled.View`
  flex-grow: 1;
  flex-basis: 46%;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.12 : 0.08)};
  shadow-radius: 14px;
  elevation: 2;
`

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

/**
 * O badge do icone ganha um halo proprio na cor do tint: e' o unico ponto de
 * cor saturada do tile, entao ele e' o que ancora o olho antes do numero.
 */
export const IconBadge = styled.View<{ $tint: string }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $tint }) => `${$tint}22`};
  border-width: 1px;
  border-color: ${({ $tint }) => `${$tint}33`};

  shadow-color: ${({ $tint }) => $tint};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  elevation: 3;
`

export const Trend = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
`

export const TrendText = styled.Text<{ $tint: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $tint }) => $tint};
`

/** Numero de estatistica: o `Stitch` pede tracking negativo pra o digito
 *  grande nao abrir espaco entre si e ficar "fofo" onde deve ser solido. */
export const Value = styled.Text`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.text};
`

export const Label = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
