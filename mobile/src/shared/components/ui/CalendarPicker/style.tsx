import { styled } from '@/shared/styles'

export const Container = styled.View`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-color: ${({ theme }) => theme.colors.border};
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.spacing.xs}px;
  padding-bottom: ${({ theme }) => theme.spacing.xs}px;
`

export const MonthLabel = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const WeekRow = styled.View`
  flex-direction: row;
`

export const Weekday = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

/** 100/7 deixa exatamente sete colunas por linha. */
export const Cell = styled.Pressable<{ $selected?: boolean; $today?: boolean }>`
  width: ${100 / 7}%;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme, $selected, $today }) =>
    $selected || $today ? `${theme.radius.md}px` : '0px'};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.accent : 'transparent')};
  border-width: ${({ $selected, $today }) => (!$selected && $today ? '1px' : '0px')};
  border-color: ${({ theme }) => theme.colors.accent};
`

export const EmptyCell = styled.View`
  width: ${100 / 7}%;
  aspect-ratio: 1;
`

export const Day = styled.Text<{ $selected?: boolean; $today?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $selected, $today }) => ($selected || $today ? 700 : 500)};
  color: ${({ theme, $selected, $today }) =>
    $selected ? theme.colors.onAccent : $today ? theme.colors.accentText : theme.colors.text};
`
