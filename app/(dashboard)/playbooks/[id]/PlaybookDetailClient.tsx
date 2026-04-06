'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/Topbar'
import { MOCK_PLAYBOOKS, MOCK_TRADES } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function PlaybookDetailClient() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const playbook = useMemo(() => MOCK_PLAYBOOKS.find(p => p.id === id), [id])

  const playbookStats = useMemo(() => {
    if (!playbook) return null
    const trades = MOCK_TRADES.filter(
      t => t.playbook_id === playbook.id && t.status === 'closed' && t.net_pnl !== null
    )
    if (trades.length === 0) return { trades: 0, winRate: 0, totalPnl: 0, avgR: 0 }
    const winners = trades.filter(t => (t.net_pnl ?? 0) > 0)
    const totalPnl = trades.reduce((sum, t) => sum + (t.net_pnl ?? 0), 0)
    const rMultiples = trades.filter(t => t.r_multiple !== null).map(t => t.r_multiple ?? 0)
    return {
      trades: trades.length,
      winRate: (winners.length / trades.length) * 100,
      totalPnl,
      avgR: rMultiples.length > 0 ? rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length : 0,
    }
  }, [playbook])

  if (!playbook) {
    return (
      <div>
        <Topbar title="Playbook" />
        <div className="p-6">
          <div className="text-center py-20 text-slate-500">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p>Playbook not found.</p>
            <Button
              variant="outline"
              className="mt-4 border-[#2a2a40] text-slate-400 hover:text-white"
              onClick={() => router.push('/playbooks')}
            >
              Back to Playbooks
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar title="Playbook Detail" />
      <div className="p-6 space-y-6">

        {/* Back */}
        <button
          onClick={() => router.push('/playbooks')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Playbooks
        </button>

        {/* Header */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: playbook.color }}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-2xl font-bold">{playbook.name}</h1>
              {playbook.description && (
                <p className="text-slate-400 mt-2">{playbook.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {playbook.asset_type && (
                  <Badge className="bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20">
                    {playbook.asset_type}
                  </Badge>
                )}
                {playbook.timeframe && (
                  <Badge className="bg-slate-700/50 text-slate-400 border-0">
                    {playbook.timeframe}
                  </Badge>
                )}
                {playbook.market_conditions && (
                  <Badge className="bg-slate-700/50 text-slate-400 border-0">
                    {playbook.market_conditions}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Entry Rules */}
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Entry Rules
            </h3>
            {playbook.entry_rules.length === 0 ? (
              <p className="text-slate-500 text-sm">No entry rules defined.</p>
            ) : (
              <ul className="space-y-3">
                {playbook.entry_rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Exit Rules */}
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Exit Rules
            </h3>
            {playbook.exit_rules.length === 0 ? (
              <p className="text-slate-500 text-sm">No exit rules defined.</p>
            ) : (
              <ul className="space-y-3">
                {playbook.exit_rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Risk Rules */}
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              Risk Rules
            </h3>
            {playbook.risk_rules.length === 0 ? (
              <p className="text-slate-500 text-sm">No risk rules defined.</p>
            ) : (
              <ul className="space-y-3">
                {playbook.risk_rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{rule}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Notes */}
        {playbook.notes && (
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-3">Notes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{playbook.notes}</p>
          </div>
        )}

        {/* Stats */}
        {playbookStats && (
          <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Performance Stats</h3>
            {playbookStats.trades === 0 ? (
              <p className="text-slate-500 text-sm">No closed trades for this playbook yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0f0f13] rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">Total Trades</div>
                  <div className="text-white font-bold text-xl">{playbookStats.trades}</div>
                </div>
                <div className="bg-[#0f0f13] rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">Win Rate</div>
                  <div className={`font-bold text-xl ${playbookStats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    {playbookStats.winRate.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-[#0f0f13] rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">Total P&L</div>
                  <div className={`font-bold text-xl ${playbookStats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(playbookStats.totalPnl)}
                  </div>
                </div>
                <div className="bg-[#0f0f13] rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">Avg R</div>
                  <div className={`font-bold text-xl ${playbookStats.avgR >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {playbookStats.avgR.toFixed(2)}R
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
