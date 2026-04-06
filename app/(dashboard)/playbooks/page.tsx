'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { PlaybookCard } from '@/components/playbooks/PlaybookCard'
import { PlaybookForm } from '@/components/playbooks/PlaybookForm'
import { MOCK_PLAYBOOKS, MOCK_TRADES } from '@/lib/mock-data'
import { Playbook } from '@/types'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus } from 'lucide-react'

function getPlaybookStats(playbookId: string) {
  const trades = MOCK_TRADES.filter(t => t.playbook_id === playbookId && t.status === 'closed' && t.net_pnl !== null)
  if (trades.length === 0) return { trades: 0, winRate: 0, totalPnl: 0 }
  const winners = trades.filter(t => (t.net_pnl ?? 0) > 0)
  return {
    trades: trades.length,
    winRate: (winners.length / trades.length) * 100,
    totalPnl: trades.reduce((sum, t) => sum + (t.net_pnl ?? 0), 0),
  }
}

export default function PlaybooksPage() {
  const [open, setOpen] = useState(false)
  const [playbooks, setPlaybooks] = useState<Playbook[]>(MOCK_PLAYBOOKS)

  const handleCreate = (data: any) => {
    const newPlaybook: Playbook = {
      id: `pb-${Date.now()}`,
      user_id: 'user-1',
      name: data.name,
      description: data.description || null,
      asset_type: data.asset_type || null,
      timeframe: data.timeframe || null,
      market_conditions: data.market_conditions || null,
      entry_rules: data.entry_rules,
      exit_rules: data.exit_rules,
      risk_rules: data.risk_rules,
      notes: data.notes || null,
      color: data.color,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    setPlaybooks(prev => [newPlaybook, ...prev])
    setOpen(false)
  }

  return (
    <div>
      <Topbar title="Playbooks" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{playbooks.length} playbook{playbooks.length !== 1 ? 's' : ''}</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            New Playbook
          </Button>
        </div>

        {/* Grid */}
        {playbooks.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No playbooks yet.</p>
            <p className="text-sm mt-1">Create your first trading strategy.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playbooks.map((pb) => (
              <PlaybookCard
                key={pb.id}
                playbook={pb}
                stats={getPlaybookStats(pb.id)}
              />
            ))}
          </div>
        )}

      </div>

      {/* New Playbook Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl bg-[#0f0f13] border-[#2a2a40] overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-white">New Playbook</SheetTitle>
          </SheetHeader>
          <PlaybookForm onSubmit={handleCreate} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
