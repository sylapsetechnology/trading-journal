'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, calculatePnL, calculateRMultiple } from '@/lib/utils'
import { EMOTIONS, MISTAKE_TAGS, SETUP_TAGS, Trade, Playbook, Account } from '@/types'
import { cn } from '@/lib/utils'

const schema = z.object({
  symbol: z.string().min(1).toUpperCase(),
  asset_type: z.enum(['stocks', 'forex', 'crypto', 'futures', 'options']),
  side: z.enum(['long', 'short']),
  account_id: z.string().optional(),
  quantity: z.coerce.number().positive(),
  entry_price: z.coerce.number().positive(),
  exit_price: z.coerce.number().positive().optional(),
  entry_date: z.string().min(1),
  exit_date: z.string().optional(),
  stop_loss: z.coerce.number().positive().optional(),
  take_profit: z.coerce.number().positive().optional(),
  commission: z.coerce.number().min(0).default(0),
  playbook_id: z.string().optional(),
  setup: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface TradeFormProps {
  trade?: Trade
  playbooks?: Playbook[]
  accounts?: Account[]
  onSubmit: (data: FormData & { emotion_before?: string; emotion_after?: string; mistake_tags: string[] }) => void
  loading?: boolean
}

export function TradeForm({ trade, playbooks = [], accounts = [], onSubmit, loading }: TradeFormProps) {
  const [side, setSide] = useState<'long' | 'short'>(trade?.side || 'long')
  const [emotionBefore, setEmotionBefore] = useState(trade?.emotion_before || '')
  const [emotionAfter, setEmotionAfter] = useState(trade?.emotion_after || '')
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>(trade?.mistake_tags || [])
  const [selectedSetup, setSelectedSetup] = useState(trade?.setup || '')
  const [liveCalc, setLiveCalc] = useState<{ gross: number; net: number; r: number } | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      symbol: trade?.symbol || '',
      asset_type: trade?.asset_type || 'stocks',
      side: trade?.side || 'long',
      quantity: trade?.quantity,
      entry_price: trade?.entry_price,
      exit_price: trade?.exit_price ?? undefined,
      entry_date: trade?.entry_date ? trade.entry_date.slice(0, 16) : new Date().toISOString().slice(0, 16),
      exit_date: trade?.exit_date ? trade.exit_date.slice(0, 16) : undefined,
      stop_loss: trade?.stop_loss ?? undefined,
      take_profit: trade?.take_profit ?? undefined,
      commission: trade?.commission ?? 0,
      notes: trade?.notes || '',
    },
  })

  const watchedValues = watch(['entry_price', 'exit_price', 'quantity', 'commission', 'stop_loss'])

  useEffect(() => {
    const [ep, xp, qty, comm, sl] = watchedValues
    if (ep && xp && qty) {
      const { grossPnl, netPnl } = calculatePnL(side, qty, ep, xp, comm || 0)
      const r = sl ? calculateRMultiple(side, ep, xp, sl) : 0
      setLiveCalc({ gross: grossPnl, net: netPnl, r })
    }
  }, [watchedValues, side])

  const toggleMistake = (val: string) => {
    setSelectedMistakes(prev => prev.includes(val) ? prev.filter(m => m !== val) : [...prev, val])
  }

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      side,
      setup: selectedSetup || undefined,
      emotion_before: emotionBefore || undefined,
      emotion_after: emotionAfter || undefined,
      mistake_tags: selectedMistakes,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Trade Info */}
      <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Trade Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-400 text-sm">Symbol</Label>
            <Input {...register('symbol')} placeholder="AAPL" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white uppercase" />
            {errors.symbol && <p className="text-red-400 text-xs mt-1">{errors.symbol.message}</p>}
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Asset Type</Label>
            <Select defaultValue="stocks" onValueChange={v => setValue('asset_type', v as FormData['asset_type'])}>
              <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                {['stocks', 'forex', 'crypto', 'futures', 'options'].map(t => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Side toggle */}
          <div className="col-span-2">
            <Label className="text-slate-400 text-sm">Side</Label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setSide('long')}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all',
                  side === 'long'
                    ? 'bg-green-500/15 text-green-400 border-green-500/40'
                    : 'text-slate-400 border-[#2a2a40] hover:border-slate-500'
                )}
              >
                ↑ Long
              </button>
              <button
                type="button"
                onClick={() => setSide('short')}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all',
                  side === 'short'
                    ? 'bg-red-500/15 text-red-400 border-red-500/40'
                    : 'text-slate-400 border-[#2a2a40] hover:border-slate-500'
                )}
              >
                ↓ Short
              </button>
            </div>
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Quantity</Label>
            <Input type="number" step="any" {...register('quantity')} placeholder="100" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Commission ($)</Label>
            <Input type="number" step="any" {...register('commission')} placeholder="0" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Entry Price</Label>
            <Input type="number" step="any" {...register('entry_price')} placeholder="150.00" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Exit Price</Label>
            <Input type="number" step="any" {...register('exit_price')} placeholder="155.00 (leave blank if open)" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Entry Date & Time</Label>
            <Input type="datetime-local" {...register('entry_date')} className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Exit Date & Time</Label>
            <Input type="datetime-local" {...register('exit_date')} className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Stop Loss</Label>
            <Input type="number" step="any" {...register('stop_loss')} placeholder="145.00" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
          <div>
            <Label className="text-slate-400 text-sm">Take Profit</Label>
            <Input type="number" step="any" {...register('take_profit')} placeholder="160.00" className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white" />
          </div>
        </div>

        {/* Live P&L calc */}
        {liveCalc && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-[#0f0f13] rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Gross P&L</div>
              <div className={`font-bold ${liveCalc.gross >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(liveCalc.gross)}</div>
            </div>
            <div className="bg-[#0f0f13] rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Net P&L</div>
              <div className={`font-bold ${liveCalc.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(liveCalc.net)}</div>
            </div>
            <div className="bg-[#0f0f13] rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">R-Multiple</div>
              <div className={`font-bold ${liveCalc.r >= 0 ? 'text-green-400' : 'text-red-400'}`}>{liveCalc.r.toFixed(2)}R</div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis */}
      <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Analysis</h3>
        <div className="space-y-4">
          {accounts.length > 0 && (
            <div>
              <Label className="text-slate-400 text-sm">Account</Label>
              <Select onValueChange={v => setValue('account_id', v)}>
                <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                  {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {playbooks.length > 0 && (
            <div>
              <Label className="text-slate-400 text-sm">Playbook</Label>
              <Select onValueChange={v => setValue('playbook_id', v)}>
                <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                  <SelectValue placeholder="Select playbook" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                  {playbooks.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-slate-400 text-sm">Setup</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SETUP_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedSetup(prev => prev === tag ? '' : tag)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full border transition-all',
                    selectedSetup === tag
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                      : 'border-[#2a2a40] text-slate-400 hover:border-slate-500'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Emotion Before</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EMOTIONS.map(e => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => setEmotionBefore(prev => prev === e.value ? '' : e.value)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2',
                    emotionBefore === e.value
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'border-[#2a2a40] text-slate-400 hover:border-slate-500'
                  )}
                >
                  <span>{e.emoji}</span> {e.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Emotion After</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EMOTIONS.map(e => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => setEmotionAfter(prev => prev === e.value ? '' : e.value)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2',
                    emotionAfter === e.value
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'border-[#2a2a40] text-slate-400 hover:border-slate-500'
                  )}
                >
                  <span>{e.emoji}</span> {e.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Mistakes</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {MISTAKE_TAGS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => toggleMistake(m.value)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg border transition-all',
                    selectedMistakes.includes(m.value)
                      ? 'bg-red-500/15 border-red-500/40 text-red-400'
                      : 'border-[#2a2a40] text-slate-400 hover:border-slate-500'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-400 text-sm">Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="What happened? What did you do well or poorly?"
              className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-sm font-semibold"
      >
        {loading ? 'Saving...' : trade ? 'Update Trade' : 'Add Trade'}
      </Button>
    </form>
  )
}
