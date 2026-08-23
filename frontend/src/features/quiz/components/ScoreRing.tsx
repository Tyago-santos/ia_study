import { scoreHex } from '@/features/quiz/lib/scoring'

interface ScoreRingProps {
  percentage: number
}

export function ScoreRing({ percentage }: ScoreRingProps) {
  const color = scoreHex(percentage)

  return (
    <div
      className="relative w-40 h-40 rounded-full flex items-center justify-center shrink-0"
      style={{ background: `conic-gradient(${color} ${percentage * 3.6}deg, var(--bg-secondary) 0deg)` }}
    >
      <div className="absolute inset-[9px] rounded-full bg-[var(--card-bg)] flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}
