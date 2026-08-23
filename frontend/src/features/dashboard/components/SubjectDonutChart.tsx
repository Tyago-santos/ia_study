import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { CHART_TOOLTIP_STYLE } from '@/features/dashboard/lib/chartTheme'

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  title?: string
  centerLabel?: string
  centerValue?: string
}

export function SubjectDonutChart({
  data,
  title = 'Distribuicao por materia',
  centerLabel,
  centerValue,
}: DonutChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="relative h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(value, name) => [`${value} min`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          {(centerLabel || centerValue) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                {centerValue && (
                  <p className="text-xl font-bold text-[var(--text)]">{centerValue}</p>
                )}
                {centerLabel && (
                  <p className="text-xs text-[var(--text-secondary)]">{centerLabel}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[var(--text-secondary)] truncate flex-1 min-w-0">
                {item.name}
              </span>
              <span className="font-medium text-[var(--text)] shrink-0">{item.value}m</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
