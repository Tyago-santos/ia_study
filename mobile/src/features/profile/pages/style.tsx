import { styled } from '@/shared/styles'

export const Section = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const Tiles = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const Identity = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`

/* Avatar em círculo cheio com borda e halo do próprio acento: é o único ponto
   de cor saturada do card, então ele ancora o olho antes do nome. */
export const Avatar = styled.View`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => `${theme.colors.accent}22`};
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.accent}33`};

  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.35;
  shadow-radius: 10px;
  elevation: 3;
`

export const AvatarText = styled.Text`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.colors.accentText};
`

export const IdentityInfo = styled.View`
  flex: 1;
  gap: 2px;
`

/* Nome do titular: 20/800 com tracking negativo — forte o bastante para ser o
   título do card, mas abaixo do título de tela (26) para não competir. */
export const Name = styled.Text`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.colors.text};
`

export const Email = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const MemberSince = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: 2px;
`

/* Data de cadastro como label: 11/700 com tracking, igual aos demais
   metadados pequenos do app. */
export const MemberSinceText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
