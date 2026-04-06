'use client'

import { useMemo, useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { TradeTable } from '@/components/journal/TradeTable'
import { TradeFilters } from '@/components/journal/TradeFilters'
import { MOCK_TRADES } from '@/lib/mock-data'
import { filterTradesByPeriod } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import { Download, Plus } from 'lucide-react'
import Link from 'next/link'
import Papa from 'papaparse'

const DEFAULT_FILTERS = { search: '', period: 'all', side: 'all', status: 'all', asset_type: 'all', setup: 'all' }

export default function JournalPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const perPage = 20

  const filteredTrades = useMemo(() => {
    let trades = filterTradesByPeriod(MOCK_TRADES, filters.period)
    if (filters.search) trades = trades.filter(t => t.symbol.toLowerCase().includes(filters.search.toLowerCase()))
    if (filters.side !== 'all') trades = trades.filter(t => t.side === filters.side)
    if (filters.status !== 'all') trades = trades.filter(t => t.status === filters.status)
    return trades.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
  }, [filters])

  const paginatedTrades = filteredTrades.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filteredTrades.length / perPage)

  const exportCSV = () => {
    const csv = Papa.unparse(filteredTrades.map(t => ({
      Date: t.entry_date,
      Symbol: t.symbol,
      Side: t.side,
      Qty: t.quantity,
      'Entry Price': t.entry_price,
      'Exit Price': t.exit_price,
      'Net P&L': t.net_pnl,
      'R-Multiple': t.r_multiple,
      Setup: t.setup,
      Status: t.status,
    })))
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'trades.csv'; a.click()
  }

  return (
    <div>
      <Topbar title="Trade Journal" />
      <div className="p-6 space-y-5">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-sm">{filteredTrades.length} trades</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="border-[#2a2a40] text-slate-300 gap-1.5 hover:text-white">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Link href="/journal/new">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5">
                <Plus className="w-3.5 h-3.5" /> New Trade
              </Button>
            </Link>
          </div>
        </div>

        <TradeFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1) }} />

        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl overflow-hidden">
          <TradeTable trades={paginatedTrades} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-[#2a2a40] text-slate-300"
            >
              Previous
            </Button>
            <span className="text-slate-400 text-sm">{page} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-[#2a2a40] text-slate-300"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
