'use client'

import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { EquityCurve } from '@/components/charts/EquityCurve'
import { DrawdownChart } from '@/components/charts/DrawdownChart'
import { PnLByDay } from '@/components/charts/PnLByDay'
import { WinLossChart } from '@/components/charts/WinLossChart'
import { HeatmapCalendar } from '@/components/charts/HeatmapCalendar'
import { MOCK_TRADES, MOCK_ACCOUNT } from '@/lib/mock-data'
import {
  computeStats,
  computeEquityCurve,
  computeDrawdown,
  computeSetupStats,
  computePnLByDayOfWeek,
  computeDailyPnL,
  filterTradesByPeriod,
} from '@/lib/analytics'
import { formatCurrency } from '@/lib/utils'
import { PERIOD_FILTERS } from '@/types'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('3m')

  const filteredTrades = useMemo(() => filterTradesByPeriod(MOCK_TRADES, period), [period])
  const stats = useMemo(() => computeStats(filteredTrades), [filteredTrades])
  const equityData = useMemo(() => computeEquityCurve(MOCK_TRADES, MOCK_ACCOUNT.initial_balance), [])
  const drawdownData = useMemo(() => computeDrawdown(MOCK_TRADES, MOCK_ACCOUNT.initial_balance), [])
  const dailyPnL = useMemo(() => computeDailyPnL(filteredTrades, 14), [filteredTrades])
  const allDailyPnL = useMemo(() => computeDailyPnL(MOCK_TRADES, 90), [])
  const setupStats = useMemo(() => computeSetupStats(filteredTrades), [filteredTrades])
  const dayOfWeekData = useMemo(() => computePnLByDayOfWeek(filteredTrades), [filteredTrades])

  const advancedStats = [
    { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%` },
    { label: 'Profit Factor', value: stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2) },
    { label: 'Max Drawdown', value: formatCurrency(stats.maxDrawdown) },
    { label: 'Avg R', value: stats.avgRMultiple.toFixed(2) },
    { label: 'Consec. Wins', value: stats.consecutiveWins },
    { label: 'Consec. Losses', value: stats.consecutiveLosses },
    { label: 'Avg Win', value: formatCurrency(stats.avgWin) },
    { label: 'Avg Loss', value: formatCurrency(stats.avgLoss) },
  ]

  return (
    <div>
      <Topbar title="Analytics" />
      <div className="p-6 space-y-6">

        {/* Period Filter */}
        <div className="flex items-center gap-1">
          {PERIOD_FILTERS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-4 py-1.5 text-sm rounded-lg transition-colors font-medium',
                period === p.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Advanced Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {advancedStats.map((s) => (
            <div key={s.label} className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">{s.label}</div>
              <div className="text-white font-semibold text-lg">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Equity Curve – full width */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Equity Curve</h3>
          <EquityCurve data={equityData} />
        </div>

        {/* Drawdown + PnL by day */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Drawdown</h3>
            <DrawdownChart data={drawdownData} />
          </div>
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Daily P&L (14d)</h3>
            <PnLByDay data={dailyPnL} />
          </div>
        </div>

        {/* Win/Loss pie + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Win / Loss</h3>
            <WinLossChart wins={stats.winningTrades} losses={stats.losingTrades} />
          </div>
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">P&L Calendar</h3>
            <HeatmapCalendar data={allDailyPnL} months={3} />
          </div>
        </div>

        {/* By Setup Table */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Performance by Setup</h3>
          {setupStats.length === 0 ? (
            <p className="text-slate-500 text-sm">No setup data for this period.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a40]">
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Setup</th>
                    <th className="text-right py-3 px-4 text-slate-500 font-medium">Trades</th>
                    <th className="text-right py-3 px-4 text-slate-500 font-medium">Win Rate</th>
                    <th className="text-right py-3 px-4 text-slate-500 font-medium">Avg P&L</th>
                    <th className="text-right py-3 px-4 text-slate-500 font-medium">Total P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {setupStats.map((s) => (
                    <tr key={s.setup} className="border-b border-[#2a2a40]/50 hover:bg-white/2 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">{s.setup}</td>
                      <td className="py-3 px-4 text-slate-300 text-right">{s.trades}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={s.winRate >= 50 ? 'text-green-400' : 'text-red-400'}>
                          {s.winRate.toFixed(0)}%
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right ${s.avgPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(s.avgPnl)}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${s.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(s.totalPnl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* P&L by Day of Week */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">P&L by Day of Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dayOfWeekData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a40', borderRadius: '8px' }}
                formatter={(val) => [formatCurrency(Number(val ?? 0)), 'P&L']}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {dayOfWeekData.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
