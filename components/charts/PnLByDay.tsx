'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { DailyPnL } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PnLByDayProps {
  data: DailyPnL[]
}

export function PnLByDay({ data }: PnLByDayProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickFormatter={val => val.slice(5)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickFormatter={val => `$${val >= 0 ? '' : '-'}${Math.abs(val / 1000).toFixed(1)}k`}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a40', borderRadius: '8px' }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(val: number) => [formatCurrency(val), 'P&L']}
        />
        <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} opacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
