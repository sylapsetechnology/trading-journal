import { Playbook } from '@/types'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { ChevronRight, TrendingUp } from 'lucide-react'

interface PlaybookCardProps {
  playbook: Playbook
  stats?: {
    trades: number
    winRate: number
    totalPnl: number
  }
}

export function PlaybookCard({ playbook, stats }: PlaybookCardProps) {
  return (
    <Link href={`/playbooks/${playbook.id}`}>
      <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5 hover:border-indigo-600/40 transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: playbook.color }} />
            <h3 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">{playbook.name}</h3>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </div>

        {playbook.description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{playbook.description}</p>
        )}

        <div className="flex items-center gap-2 mb-4">
          {playbook.asset_type && (
            <span className="px-2 py-0.5 bg-indigo-600/10 text-indigo-400 text-xs rounded-full border border-indigo-600/20">
              {playbook.asset_type}
            </span>
          )}
          {playbook.timeframe && (
            <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded-full">{playbook.timeframe}</span>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#2a2a40]">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-0.5">Trades</div>
              <div className="text-white font-semibold text-sm">{stats.trades}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-0.5">Win Rate</div>
              <div className="text-white font-semibold text-sm">{stats.winRate.toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-0.5">P&L</div>
              <div className={`font-semibold text-sm ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(stats.totalPnl)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
