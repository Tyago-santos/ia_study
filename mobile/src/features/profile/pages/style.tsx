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

export const Avatar = styled.View`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => `${theme.colors.accent}22`};
`

export const AvatarText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentText};
`

export const IdentityInfo = styled.View`
  flex: 1;
  gap: 2px;
`

export const Name = styled.Text`
  font-size: 18px;
  font-weight: 700;
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

export const MemberSinceText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
