import { styled } from '@/shared/styles'

export const Intro = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  gap: 2px;
`

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Subtitle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Pomodoro = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`

export const Tiles = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const Section = styled.View`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`

export const Hint = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ------------------------- Grafico da semana ------------------------- */

export const Chart = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const ChartColumn = styled.View`
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`

export const ChartValue = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const Bar = styled.View<{ $height: number }>`
  width: 70%;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accent};
`

export const ChartLabel = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* --------------------- Distribuicao por materia ---------------------- */

export const DistributionRow = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`

export const DistributionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const DistributionName = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const DistributionValue = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* -------------------------- Atividade recente ------------------------ */

export const ActivityRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`

export const ActivityIcon = styled.View<{ $color: string }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => `${$color}22`};
`

export const ActivityInfo = styled.View`
  flex: 1;
  gap: 1px;
`

export const ActivityTitle = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const ActivityDescription = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const ActivityTime = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
