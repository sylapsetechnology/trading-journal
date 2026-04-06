'use client'

import { Trade } from '@/types'
import { formatCurrency, formatNumber, pnlColor, cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'

interface TradeTableProps {
  trades: Trade[]
  compact?: boolean
}

export function TradeTable({ trades, compact = false }: TradeTableProps) {
  if (trades.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg mb-1">No trades found</p>
        <p className="text-sm">Add your first trade to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a40]">
            {['Date', 'Symbol', 'Side', 'Qty', 'Entry', 'Exit', 'P&L', 'R:R', 'Setup', 'Status'].map(h => (
              <th key={h} className="text-left text-xs font-medium text-slate-400 py-3 px-3 whitespace-nowrap">{h}</th>
            ))}
            {!compact && <th className="text-left text-xs font-medium text-slate-400 py-3 px-3"></th>}
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => {
            const pnl = trade.net_pnl
            return (
              <tr key={trade.id} className="border-b border-[#2a2a40]/50 hover:bg-white/2 transition-colors">
                <td className="py-3 px-3 text-sm text-slate-400 whitespace-nowrap">
                  {format(new Date(trade.entry_date), 'MMM d, yy')}
                </td>
                <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">{trade.symbol}</td>
                <td className="py-3 px-3">
                  {trade.side === 'long' ? (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 gap-1">
                      <ArrowUp className="w-3 h-3" /> Long
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 gap-1">
                      <ArrowDown className="w-3 h-3" /> Short
                    </Badge>
                  )}
                </td>
                <td className="py-3 px-3 text-sm text-slate-300">{formatNumber(trade.quantity, 0)}</td>
                <td className="py-3 px-3 text-sm text-slate-300">${formatNumber(trade.entry_price)}</td>
                <td className="py-3 px-3 text-sm text-slate-300">
                  {trade.exit_price ? `$${formatNumber(trade.exit_price)}` : '—'}
                </td>
                <td className={cn('py-3 px-3 text-sm font-semibold', pnlColor(pnl))}>
                  {pnl !== null ? formatCurrency(pnl) : '—'}
                </td>
                <td className="py-3 px-3 text-sm text-slate-300">
                  {trade.r_multiple !== null ? `${formatNumber(trade.r_multiple)}R` : '—'}
                </td>
                <td className="py-3 px-3 text-sm text-slate-400">{trade.setup || '—'}</td>
                <td className="py-3 px-3">
                  <Badge
                    className={cn(
                      'text-xs',
                      trade.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      trade.status === 'closed' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    )}
                  >
                    {trade.status}
                  </Badge>
                </td>
                {!compact && (
                  <td className="py-3 px-3">
                    <Link href={`/journal/${trade.id}`} className="text-slate-400 hover:text-indigo-400 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
