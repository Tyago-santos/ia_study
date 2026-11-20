import { styled } from '@/shared/styles'

export const Container = styled.View<{ $bottomInset: number }>`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
  padding-top: 6px;
  padding-bottom: ${({ theme, $bottomInset }) => Math.max($bottomInset, theme.spacing.xs)}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
`

export const Tab = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  min-height: 56px;
`

export const IconWrap = styled.View<{ $active: boolean }>`
  width: 38px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, $active }) => ($active ? `${theme.colors.accent}1f` : 'transparent')};
`

export const Label = styled.Text<{ $active: boolean }>`
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentText : theme.colors.textSecondary};
`

export const FeaturedWrap = styled.View`
  z-index: 1;
  width: 66px;
  height: 66px;
  align-items: center;
  justify-content: center;
  margin-top: -26px;
`

export const FeaturedHalo = styled.View`
  position: absolute;
  width: 66px;
  height: 66px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => `${theme.colors.accent}1f`};
`

export const FeaturedFrame = styled.View`
  width: 58px;
  height: 58px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.accent}22`};
`

export const FeaturedButton = styled.View<{ $active: boolean }>`
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-width: 3px;
  border-color: transparent;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : `${theme.colors.accent}ee`};
  shadow-color: ${({ theme }) => theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ $active }) => ($active ? 0.4 : 0.28)};
  shadow-radius: 10px;
  elevation: ${({ $active }) => ($active ? 7 : 4)};
`
