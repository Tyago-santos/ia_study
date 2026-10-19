import type { CSSProperties } from 'react'

/*
 * Paleta Cognitive Flow: indigo de marca, violeta secundario e cyan terciario,
 * com dois tons extras legiveis tanto sobre superficie escura quanto clara
 * (nada de verde saturado nem de branco/claro puro).
 */
export const CHART_COLORS = [
  '#4f46e5', // primary-500
  '#8b5cf6', // secondary-500
  '#4cd7f6', // tertiary-400
  '#6366f1', // indigo intermediario
  '#a78bfa', // secondary-400
  '#06b6d4', // tertiary-500
  '#3730a3', // primary-700
]

export const CHART_TOOLTIP_STYLE: CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}
