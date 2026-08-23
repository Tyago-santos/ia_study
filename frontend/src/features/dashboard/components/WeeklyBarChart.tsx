import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from '@/features/dashboard/lib/chartTheme'

interface BarChartProps {
  data: { name: string; minutes: number; pomodoros: number }[]
  title?: string
}

export function WeeklyBarChart({ data, title = 'Horas estudadas' }: BarChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary-500" />
            Minutos
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary-300 dark:bg-primary-700" />
            Pomodoros
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              width={35}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--text-secondary)' }}
              formatter={(value, name) => [
                name === 'minutes' ? `${value} min` : `${value} pomodoros`,
                name === 'minutes' ? 'Tempo' : 'Pomodoros',
              ]}
            />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.9} />
              ))}
            </Bar>
            <Bar dataKey="pomodoros" radius={[6, 6, 0, 0]} maxBarSize={40} fillOpacity={0.3}>
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
