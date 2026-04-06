'use client'

import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/dashboard/StatCard'
import { TradeTable } from '@/components/journal/TradeTable'
import { EquityCurve } from '@/components/charts/EquityCurve'
import { PnLByDay } from '@/components/charts/PnLByDay'
import { MOCK_TRADES, MOCK_ACCOUNT } from '@/lib/mock-data'
import { computeStats, computeDailyPnL, computeEquityCurve, filterTradesByPeriod } from '@/lib/analytics'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart2, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERIOD_FILTERS } from '@/types'

export default function DashboardPage() {
  const [period, setPeriod] = useState('1m')
  const filteredTrades = useMemo(() => filterTradesByPeriod(MOCK_TRADES, period), [period])
  const stats = useMemo(() => computeStats(filteredTrades), [filteredTrades])
  const dailyPnL = useMemo(() => computeDailyPnL(MOCK_TRADES, 14), [])
  const equityData = useMemo(() => computeEquityCurve(MOCK_TRADES, MOCK_ACCOUNT.initial_balance), [])
  const openTrades = MOCK_TRADES.filter(t => t.status === 'open')
  const recentTrades = filteredTrades.filter(t => t.status === 'closed').slice(0, 5)

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6">

        {/* Period filter */}
        <div className="flex items-center gap-1">
          {PERIOD_FILTERS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-4 py-1.5 text-sm rounded-lg transition-colors font-medium',
                period === p.value ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Net P&L" value={stats.totalPnl} isCurrency icon={DollarSign} />
          <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} icon={Target} />
          <StatCard title="Total Trades" value={stats.totalTrades} icon={BarChart2} />
          <StatCard title="Avg R:R" value={stats.avgRR.toFixed(2)} icon={Activity} />
          <StatCard
            title="Best Trade"
            value={formatCurrency(stats.bestTrade)}
            icon={TrendingUp}
            valueClassName="text-green-400"
          />
          <StatCard
            title="Worst Trade"
            value={formatCurrency(stats.worstTrade)}
            icon={TrendingDown}
            valueClassName="text-red-400"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Equity Curve</h3>
            <EquityCurve data={equityData} />
          </div>
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Daily P&L (14d)</h3>
            <PnLByDay data={dailyPnL} />
          </div>
        </div>

        {/* Open Trades */}
        {openTrades.length > 0 && (
          <div className="bg-[#1a1a24] border border-indigo-600/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-white font-semibold">Open Positions ({openTrades.length})</h3>
            </div>
            <TradeTable trades={openTrades} compact />
          </div>
        )}

        {/* Recent Trades */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Trades</h3>
            <a href="/journal" className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">View all →</a>
          </div>
          <TradeTable trades={recentTrades} compact />
        </div>
      </div>
    </div>
  )
}
