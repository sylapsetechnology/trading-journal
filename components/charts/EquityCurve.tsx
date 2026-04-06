'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { EquityPoint } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface EquityCurveProps {
  data: EquityPoint[]
}

export function EquityCurve({ data }: EquityCurveProps) {
  const isPositive = data.length > 1 && data[data.length - 1].equity >= data[0].equity

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
            <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a40" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickFormatter={val => val.slice(5)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickFormatter={val => `$${(val / 1000).toFixed(0)}k`}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a40', borderRadius: '8px' }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(val: unknown) => [formatCurrency(val as number), 'Equity']}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke={isPositive ? '#22c55e' : '#ef4444'}
          strokeWidth={2}
          fill="url(#equityGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
