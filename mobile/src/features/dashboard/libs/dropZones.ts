/**
 * Geometria do arrasto do planner. Fica fora do componente porque roda na UI
 * thread do Reanimated: e codigo puro, sem React, chamado a cada frame.
 */

export interface DropZone {
  dayIndex: number
  x: number
  y: number
  width: number
  height: number
}

/** Quanto o dedo pode passar do dia e ainda contar como drop naquele dia. */
export const DROP_TOLERANCE = 28

/**
 * Qual dia esta sob o dedo. Roda na UI thread a cada frame do arrasto, por isso
 * e um worklet e recebe os retangulos ja medidos em coordenadas de tela.
 *
 * Sem tolerancia o vao entre dois dias vira zona morta e o drop simplesmente
 * nao acontece, entao o alvo exato tem prioridade e o dia mais proximo na
 * vertical serve de rede de seguranca.
 */
export function findDayAt(zones: DropZone[], x: number, y: number): number {
  'worklet'
  let nearest = -1
  let nearestDistance = DROP_TOLERANCE

  for (const zone of zones) {
    const withinX = x >= zone.x - DROP_TOLERANCE && x <= zone.x + zone.width + DROP_TOLERANCE
    if (!withinX) continue

    if (y >= zone.y && y <= zone.y + zone.height) return zone.dayIndex

    const distance = y < zone.y ? zone.y - y : y - (zone.y + zone.height)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearest = zone.dayIndex
    }
  }

  return nearest
}
