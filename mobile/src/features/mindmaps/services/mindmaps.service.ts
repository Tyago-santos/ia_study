import type { MindMap } from '@/shared/types'

/** Limites do zoom do canvas; fora deles o mapa fica ilegivel ou some. */
export const MIN_SCALE = 0.4
export const MAX_SCALE = 2.5

/** Enquadramento inicial: mostra a arvore inteira sem precisar afastar. */
export const INITIAL_SCALE = 0.8

export function clampScale(scale: number): number {
  'worklet'
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

export function totalNodes(maps: MindMap[]): number {
  return maps.reduce((sum, map) => sum + map.nodes.length, 0)
}
