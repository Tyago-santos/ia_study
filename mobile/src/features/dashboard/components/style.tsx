import Animated from 'react-native-reanimated'
import { styled } from '@/shared/styles'

/* --------------------------------- Meta --------------------------------- */

export const GoalAction = styled.Pressable`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const TotalText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const GoalBlock = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`

export const GoalCaption = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const GoalModalLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Hint = styled.Text`
  font-size: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* -------------------------------- Paleta -------------------------------- */

/* Borda tracejada marca a area como origem do arrasto, nao como conteudo. */
export const Palette = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-style: dashed;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.bgSecondary};
`

export const PaletteLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const PaletteEmpty = styled.Text`
  font-size: 12px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const SubjectChip = styled.View<{ $color: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-left: 5px;
  padding-right: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: 5px;
  background-color: ${({ $color }) => `${$color}14`};
  border-color: ${({ $color }) => `${$color}44`};
`

export const SubjectChipIcon = styled.View<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
`

export const SubjectChipLabel = styled.Text<{ $color: string }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

export const EventChip = styled.View<{ $color: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-style: dashed;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: 6px;
  max-width: 200px;
  background-color: ${({ $color }) => `${$color}14`};
  border-color: ${({ $color }) => `${$color}55`};
`

export const EventChipLabel = styled.Text<{ $color: string }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

/* --------------------------------- Dia ---------------------------------- */

/* A cor de borda/fundo do realce vem do worklet de hover e chega pelo `style`,
   por isso nao esta declarada aqui. */
export const DayContainer = styled(Animated.View)`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`

export const DayHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`

export const DayName = styled.Text`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const DayTotal = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 3px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 2px;
  background-color: ${({ theme }) => `${theme.colors.accent}22`};
`

export const DayTotalText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentText};
`

export const DayBlocks = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const DayEmpty = styled.Text`
  font-size: 12px;
  font-style: italic;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const EventItem = styled.View<{ $color: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-style: dashed;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 6px;
  border-color: ${({ $color }) => `${$color}66`};
  background-color: ${({ $color }) => `${$color}0F`};
`

export const EventTitle = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const EventTime = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* -------------------------------- Bloco --------------------------------- */

export const Block = styled.Pressable<{ $color: string }>`
  flex-direction: row;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  overflow: hidden;
  background-color: ${({ $color }) => `${$color}12`};
  border-color: ${({ $color }) => `${$color}40`};
`

export const BlockAccent = styled.View<{ $color: string }>`
  width: 4px;
  background-color: ${({ $color }) => $color};
`

export const BlockBody = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const BlockTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const BlockIcon = styled.View<{ $color: string }>`
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}26`};
`

export const BlockName = styled.Text`
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const DurationPill = styled.View<{ $color: string }>`
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 2px;
  background-color: ${({ $color }) => `${$color}26`};
`

export const DurationText = styled.Text<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

export const BlockBottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const BlockTopic = styled.Text`
  flex: 1;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const BlockControls = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

/* ---------------------- Editor de horario e assunto ---------------------- */

export const TopicPicker = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const TopicPickerLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const TopicOptions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const TopicOption = styled.Pressable<{ $color: string; $selected: boolean }>`
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: 4px;
  border-color: ${({ theme, $color, $selected }) => ($selected ? $color : theme.colors.border)};
  background-color: ${({ $color, $selected }) => ($selected ? `${$color}22` : 'transparent')};
`

export const TopicOptionLabel = styled.Text<{ $color: string; $selected: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme, $color, $selected }) => ($selected ? $color : theme.colors.textSecondary)};
`

export const TimeRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const TimeInput = styled.TextInput`
  outline-style: none;
  width: 78px;
  border-width: 1px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  border-color: ${({ theme }) => theme.colors.border};
`

export const TimeEnd = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
