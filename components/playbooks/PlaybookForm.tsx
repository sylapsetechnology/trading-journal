'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Playbook } from '@/types'
import { Plus, X } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  asset_type: z.string().optional(),
  timeframe: z.string().optional(),
  market_conditions: z.string().optional(),
  notes: z.string().optional(),
  color: z.string().default('#6366f1'),
})

type FormData = z.infer<typeof schema>

interface PlaybookFormProps {
  playbook?: Playbook
  onSubmit: (data: FormData & { entry_rules: string[]; exit_rules: string[]; risk_rules: string[] }) => void
  loading?: boolean
}

function RuleList({ label, rules, onChange }: { label: string; rules: string[]; onChange: (r: string[]) => void }) {
  const [input, setInput] = useState('')

  const add = () => {
    if (input.trim()) { onChange([...rules, input.trim()]); setInput('') }
  }

  return (
    <div>
      <Label className="text-slate-400 text-sm">{label}</Label>
      <div className="mt-2 space-y-2">
        {rules.map((r, i) => (
          <div key={i} className="flex items-center gap-2 bg-[#0f0f13] rounded-lg px-3 py-2">
            <span className="text-slate-300 text-sm flex-1">{r}</span>
            <button type="button" onClick={() => onChange(rules.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
            placeholder="Add a rule..."
            className="bg-[#0f0f13] border-[#2a2a40] text-white text-sm"
          />
          <Button type="button" onClick={add} size="sm" variant="outline" className="border-[#2a2a40] text-slate-400 hover:text-white">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#f97316', '#ec4899']

export function PlaybookForm({ playbook, onSubmit, loading }: PlaybookFormProps) {
  const [entryRules, setEntryRules] = useState<string[]>(playbook?.entry_rules || [])
  const [exitRules, setExitRules] = useState<string[]>(playbook?.exit_rules || [])
  const [riskRules, setRiskRules] = useState<string[]>(playbook?.risk_rules || [])
  const [selectedColor, setSelectedColor] = useState(playbook?.color || '#6366f1')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: playbook?.name || '',
      description: playbook?.description || '',
      asset_type: playbook?.asset_type || '',
      timeframe: playbook?.timeframe || '',
      market_conditions: playbook?.market_conditions || '',
      notes: playbook?.notes || '',
      color: playbook?.color || '#6366f1',
    },
  })

  const handleFormSubmit = (data: FormData) => {
    onSubmit({ ...data, color: selectedColor, entry_rules: entryRules, exit_rules: exitRules, risk_rules: riskRules })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Playbook Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label className="text-slate-400 text-sm">Name *</Label>
            <Input {...register('name')} placeholder="VWAP Breakout" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
          <div className="col-span-2">
            <Label className="text-slate-400 text-sm">Description</Label>
            <Textarea {...register('description')} placeholder="Describe your strategy..." className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Asset Type</Label>
            <Select defaultValue={playbook?.asset_type || ''} onValueChange={v => setValue('asset_type', v)}>
              <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                {['stocks', 'forex', 'crypto', 'futures', 'options'].map(t => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Timeframe</Label>
            <Select defaultValue={playbook?.timeframe || ''} onValueChange={v => setValue('timeframe', v)}>
              <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                {['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label className="text-slate-400 text-sm">Market Conditions</Label>
            <Input {...register('market_conditions')} placeholder="Trending, high volume days" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
          <div className="col-span-2">
            <Label className="text-slate-400 text-sm">Color</Label>
            <div className="flex gap-2 mt-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-white/40' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Rules</h3>
        <RuleList label="Entry Rules" rules={entryRules} onChange={setEntryRules} />
        <RuleList label="Exit Rules" rules={exitRules} onChange={setExitRules} />
        <RuleList label="Risk Rules" rules={riskRules} onChange={setRiskRules} />
      </div>

      <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
        <Label className="text-slate-400 text-sm">Notes</Label>
        <Textarea {...register('notes')} placeholder="Additional notes about this strategy..." className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white min-h-[80px]" />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
        {loading ? 'Saving...' : playbook ? 'Update Playbook' : 'Create Playbook'}
      </Button>
    </form>
  )
}
