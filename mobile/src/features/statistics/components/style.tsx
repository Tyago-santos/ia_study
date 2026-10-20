import { styled } from '@/shared/styles'
import { CELL_SIZE } from '../services/statistics.service'

export const Calendar = styled.View`
  flex-direction: row;
  gap: 3px;
`

export const CalendarWeek = styled.View`
  gap: 3px;
`

/**
 * Dia sem estudo usa o cinza de fundo em opacidade cheia; os demais pintam o
 * acento com a opacidade da faixa, o que da a escala do mais claro ao mais
 * forte sem precisar de quatro cores separadas.
 */
/* Quadradinho com canto suave: raio 4 é o ponto em que a grade lê como
   grade arredondada sem os 12px virarem bolinha. */
export const CalendarCell = styled.View<{ $intensity: number }>`
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border-radius: 4px;
  background-color: ${({ theme, $intensity }) =>
    $intensity === 0 ? theme.colors.bgSecondary : theme.colors.accent};
  opacity: ${({ $intensity }) => ($intensity === 0 ? 1 : $intensity)};
`

export const Legend = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`

/* Mesmo peso dos labels do app: "Menos/Mais" são legenda, não texto corrido. */
export const LegendText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.textSecondary};
`
