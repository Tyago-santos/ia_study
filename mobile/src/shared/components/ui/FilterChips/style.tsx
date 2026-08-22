import { ScrollView } from 'react-native'
import { styled } from '@/shared/styles'

export const Row = styled(ScrollView).attrs(({ theme }) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    flexDirection: 'row' as const,
    gap: theme.spacing.sm,
    paddingVertical: 2,
  },
}))``

export const Chip = styled.Pressable<{ $tint: string; $active: boolean }>`
  outline-style: none;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm - 2}px;
  background-color: ${({ theme, $tint, $active }) =>
    $active ? `${$tint}22` : theme.colors.card};
  border-color: ${({ theme, $tint, $active }) => ($active ? $tint : theme.colors.border)};
`

export const ChipLabel = styled.Text<{ $tint: string; $active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $tint, $active }) => ($active ? $tint : theme.colors.textSecondary)};
`
