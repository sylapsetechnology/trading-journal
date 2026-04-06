'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { PERIOD_FILTERS } from '@/types'
import { cn } from '@/lib/utils'

interface Filters {
  search: string
  period: string
  side: string
  status: string
  asset_type: string
  setup: string
}

interface TradeFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TradeFilters({ filters, onChange }: TradeFiltersProps) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const clear = () => {
    onChange({ search: '', period: 'all', side: 'all', status: 'all', asset_type: 'all', setup: 'all' })
  }

  const hasFilters = filters.search || filters.period !== 'all' || filters.side !== 'all' || filters.status !== 'all'

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search symbol..."
          value={filters.search}
          onChange={e => update('search', e.target.value)}
          className="pl-9 bg-[#1a1a24] border-[#2a2a40] text-white placeholder:text-slate-500"
        />
      </div>

      <div className="flex gap-1">
        {PERIOD_FILTERS.map(p => (
          <button
            key={p.value}
            onClick={() => update('period', p.value)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors font-medium',
              filters.period === p.value
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Select value={filters.side} onValueChange={v => update('side', v)}>
        <SelectTrigger className="w-[120px] bg-[#1a1a24] border-[#2a2a40] text-white">
          <SelectValue placeholder="Side" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
          <SelectItem value="all">All Sides</SelectItem>
          <SelectItem value="long">Long</SelectItem>
          <SelectItem value="short">Short</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={v => update('status', v)}>
        <SelectTrigger className="w-[130px] bg-[#1a1a24] border-[#2a2a40] text-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="partial">Partial</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clear} className="text-slate-400 gap-1">
          <X className="w-3 h-3" /> Clear
        </Button>
      )}
    </div>
  )
}
