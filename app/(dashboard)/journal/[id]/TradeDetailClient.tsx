'use client'

import { useParams, useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/Topbar'
import { MOCK_TRADES, MOCK_PLAYBOOKS } from '@/lib/mock-data'
import { formatCurrency, formatNumber, pnlColor, getTradeDuration } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { EMOTIONS, MISTAKE_TAGS } from '@/types'

export default function TradeDetailClient() {
  const { id } = useParams()
  const router = useRouter()
  const trade = MOCK_TRADES.find(t => t.id === id)

  if (!trade) {
    return (
      <div>
        <Topbar title="Trade Not Found" />
        <div className="p-6 text-center text-slate-400">
          <p>Trade not found.</p>
          <Link href="/journal" className="text-indigo-400 hover:underline mt-2 block">← Back to Journal</Link>
        </div>
      </div>
    )
  }

  const playbook = MOCK_PLAYBOOKS.find(p => p.id === trade.playbook_id)
  const emotionBefore = EMOTIONS.find(e => e.value === trade.emotion_before)
  const emotionAfter = EMOTIONS.find(e => e.value === trade.emotion_after)

  return (
    <div>
      <Topbar title={`${trade.symbol} — Trade Detail`} />
      <div className="p-6 max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <Link href="/journal" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#2a2a40] text-slate-300 gap-1.5">
              <Edit className="w-3.5 h-3.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Header card */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{trade.symbol}</h2>
                <Badge className={trade.side === 'long' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                  {trade.side === 'long' ? '↑ Long' : '↓ Short'}
                </Badge>
                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 capitalize">{trade.status}</Badge>
              </div>
              <p className="text-slate-400 text-sm capitalize">{trade.asset_type} • {trade.quantity} shares</p>
            </div>
            {trade.net_pnl !== null && (
              <div className="text-right">
                <div className={cn('text-3xl font-bold', pnlColor(trade.net_pnl))}>{formatCurrency(trade.net_pnl)}</div>
                <div className="text-slate-400 text-sm">Net P&L</div>
              </div>
            )}
          </div>

          {/* P&L breakdown */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Gross P&L', value: trade.gross_pnl !== null ? formatCurrency(trade.gross_pnl) : '—', color: pnlColor(trade.gross_pnl) },
              { label: 'Commission', value: formatCurrency(-trade.commission), color: 'text-slate-400' },
              { label: 'R-Multiple', value: trade.r_multiple !== null ? `${formatNumber(trade.r_multiple)}R` : '—', color: pnlColor(trade.r_multiple) },
              { label: 'Duration', value: getTradeDuration(trade.entry_date, trade.exit_date), color: 'text-slate-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#0f0f13] rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">{label}</div>
                <div className={cn('font-semibold text-sm', color)}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trade info */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Trade Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Entry Price', value: `$${formatNumber(trade.entry_price)}` },
              { label: 'Exit Price', value: trade.exit_price ? `$${formatNumber(trade.exit_price)}` : '—' },
              { label: 'Entry Date', value: format(new Date(trade.entry_date), 'MMM d, yyyy HH:mm') },
              { label: 'Exit Date', value: trade.exit_date ? format(new Date(trade.exit_date), 'MMM d, yyyy HH:mm') : '—' },
              { label: 'Stop Loss', value: trade.stop_loss ? `$${formatNumber(trade.stop_loss)}` : '—' },
              { label: 'Take Profit', value: trade.take_profit ? `$${formatNumber(trade.take_profit)}` : '—' },
              { label: 'Playbook', value: playbook?.name || '—' },
              { label: 'Setup', value: trade.setup || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-xs text-slate-400 mb-0.5">{label}</div>
                <div className="text-slate-200 text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Psychology */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Psychology & Analysis</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-slate-400 mb-2">Emotion Before</div>
              {emotionBefore ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0f0f13] rounded-lg text-sm text-slate-200">
                  {emotionBefore.emoji} {emotionBefore.label}
                </span>
              ) : <span className="text-slate-500 text-sm">—</span>}
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-2">Emotion After</div>
              {emotionAfter ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0f0f13] rounded-lg text-sm text-slate-200">
                  {emotionAfter.emoji} {emotionAfter.label}
                </span>
              ) : <span className="text-slate-500 text-sm">—</span>}
            </div>
          </div>

          {trade.mistake_tags && trade.mistake_tags.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-slate-400 mb-2">Mistakes</div>
              <div className="flex flex-wrap gap-2">
                {trade.mistake_tags.map(tag => {
                  const m = MISTAKE_TAGS.find(mt => mt.value === tag)
                  return (
                    <span key={tag} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20">
                      {m?.label || tag}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {trade.notes && (
            <div>
              <div className="text-xs text-slate-400 mb-2">Notes</div>
              <p className="text-slate-300 text-sm bg-[#0f0f13] rounded-lg p-3 leading-relaxed">{trade.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
