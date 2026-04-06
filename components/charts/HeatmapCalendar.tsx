'use client'

import { eachDayOfInterval, format, subMonths, startOfMonth, endOfMonth, getDay } from 'date-fns'
import { DailyPnL } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface HeatmapCalendarProps {
  data: DailyPnL[]
  months?: number
}

function getPnLColor(pnl: number): string {
  if (pnl === 0) return 'bg-[#2a2a40]'
  if (pnl > 500) return 'bg-green-600'
  if (pnl > 200) return 'bg-green-500'
  if (pnl > 0) return 'bg-green-700/70'
  if (pnl > -200) return 'bg-red-700/70'
  if (pnl > -500) return 'bg-red-500'
  return 'bg-red-600'
}

export function HeatmapCalendar({ data, months = 3 }: HeatmapCalendarProps) {
  const pnlMap: Record<string, number> = {}
  for (const d of data) pnlMap[d.date] = d.pnl

  const now = new Date()
  const start = startOfMonth(subMonths(now, months - 1))
  const end = endOfMonth(now)
  const days = eachDayOfInterval({ start, end })

  const weeks: Date[][] = []
  let week: Date[] = []

  // Pad first week
  const firstDay = getDay(days[0])
  for (let i = 0; i < firstDay; i++) week.push(null as unknown as Date)

  for (const day of days) {
    week.push(day)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null as unknown as Date)
    weeks.push(week)
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-xs text-slate-500">{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((day, di) => {
            if (!day) return <div key={di} className="h-8 rounded" />
            const dateStr = format(day, 'yyyy-MM-dd')
            const pnl = pnlMap[dateStr] ?? 0
            const isToday = dateStr === format(now, 'yyyy-MM-dd')
            return (
              <div
                key={di}
                title={`${dateStr}: ${formatCurrency(pnl)}`}
                className={`h-8 rounded text-xs flex items-center justify-center text-white/60 cursor-default transition-opacity hover:opacity-90 ${getPnLColor(pnl)} ${isToday ? 'ring-1 ring-indigo-400' : ''}`}
              >
                <span className="text-[10px]">{format(day, 'd')}</span>
              </div>
            )
          })}
        </div>
      ))}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-slate-500">Less</span>
        {['bg-red-600', 'bg-red-700/70', 'bg-[#2a2a40]', 'bg-green-700/70', 'bg-green-500', 'bg-green-600'].map((c, i) => (
          <div key={i} className={`w-4 h-4 rounded ${c}`} />
        ))}
        <span className="text-xs text-slate-500">More</span>
      </div>
    </div>
  )
}
