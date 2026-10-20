import { styled } from '@/shared/styles'

/**
 * Painel base do app.
 *
 * A profundidade vem de dois recursos que o Stitch usa no lugar de sombra
 * preta dura: borda de baixo contraste (um tom acima do fundo, nao um contorno
 * aceso) e um halo indigo muito discreto embaixo. No escuro o halo e' o que
 * separa o card do fundo; no claro e na leitura ele quase some, porque la a
 * separacao ja' vem do proprio tom.
 */
export const Container = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) =>
    theme.name === 'dark' ? 'rgba(255, 255, 255, 0.07)' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.card};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 8px;
  shadow-opacity: ${({ theme }) => (theme.name === 'dark' ? 0.16 : 0.1)};
  shadow-radius: 20px;
  elevation: 3;
`
