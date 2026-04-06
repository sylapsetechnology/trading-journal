'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Topbar } from '@/components/layout/Topbar'
import { MOCK_PSYCHOLOGY } from '@/lib/mock-data'
import { PsychologyEntry } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  if (score === null) return null
  const color =
    score >= 7 ? 'bg-green-500' : score >= 5 ? 'bg-amber-400' : 'bg-red-500'
  const textColor =
    score >= 7 ? 'text-green-400' : score >= 5 ? 'text-amber-400' : 'text-red-400'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={cn('text-xs font-semibold', textColor)}>{score}/10</span>
      </div>
      <div className="h-1.5 bg-[#2a2a40] rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  )
}

function EntryCard({ entry }: { entry: PsychologyEntry }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5 hover:border-indigo-600/30 transition-colors cursor-pointer"
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-white font-semibold">
            {format(new Date(entry.date), 'EEEE, MMM d yyyy')}
          </div>
          <div className="flex items-center gap-3 mt-1">
            {entry.goals_met !== null && (
              <span className={cn('text-xs flex items-center gap-1', entry.goals_met ? 'text-green-400' : 'text-slate-500')}>
                {entry.goals_met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                Goals {entry.goals_met ? 'met' : 'not met'}
              </span>
            )}
            {entry.followed_rules !== null && (
              <span className={cn('text-xs flex items-center gap-1', entry.followed_rules ? 'text-green-400' : 'text-red-400')}>
                {entry.followed_rules ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                Rules {entry.followed_rules ? 'followed' : 'broken'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <ScoreBar label="Mood" score={entry.mood_score} />
        <ScoreBar label="Energy" score={entry.energy_score} />
        <ScoreBar label="Confidence" score={entry.confidence_score} />
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-[#2a2a40]">
          {entry.pre_session_notes && (
            <div>
              <div className="text-xs text-slate-500 mb-1">Pre-Session Notes</div>
              <p className="text-slate-300 text-sm">{entry.pre_session_notes}</p>
            </div>
          )}
          {entry.post_session_notes && (
            <div>
              <div className="text-xs text-slate-500 mb-1">Post-Session Notes</div>
              <p className="text-slate-300 text-sm">{entry.post_session_notes}</p>
            </div>
          )}
          {entry.lessons_learned && (
            <div>
              <div className="text-xs text-slate-500 mb-1">Lessons Learned</div>
              <p className="text-indigo-300 text-sm italic">"{entry.lessons_learned}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const EMPTY_FORM = {
  date: format(new Date(), 'yyyy-MM-dd'),
  mood_score: '7',
  energy_score: '7',
  confidence_score: '7',
  pre_session_notes: '',
  post_session_notes: '',
  lessons_learned: '',
  followed_rules: true,
  goals_met: true,
}

export default function PsychologyPage() {
  const [entries, setEntries] = useState<PsychologyEntry[]>(MOCK_PSYCHOLOGY)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const handleSave = () => {
    const newEntry: PsychologyEntry = {
      id: `psych-${Date.now()}`,
      user_id: 'user-1',
      date: form.date,
      mood_score: parseInt(form.mood_score) || null,
      energy_score: parseInt(form.energy_score) || null,
      confidence_score: parseInt(form.confidence_score) || null,
      pre_session_notes: form.pre_session_notes || null,
      post_session_notes: form.post_session_notes || null,
      lessons_learned: form.lessons_learned || null,
      followed_rules: form.followed_rules,
      goals_met: form.goals_met,
      created_at: new Date().toISOString(),
    }
    setEntries(prev => [newEntry, ...prev])
    setOpen(false)
    setForm(EMPTY_FORM)
  }

  return (
    <div>
      <Topbar title="Psychology Journal" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">{entries.length} journal entries</p>
          <Button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </div>

        {/* Entries grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {entries.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>

      </div>

      {/* New Entry Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl bg-[#0f0f13] border-[#2a2a40] overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-white">New Psychology Entry</SheetTitle>
          </SheetHeader>

          <div className="space-y-5">
            {/* Date */}
            <div>
              <Label className="text-slate-400 text-sm">Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="mt-1 bg-[#1a1a24] border-[#2a2a40] text-white"
              />
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-3">
              {(['mood_score', 'energy_score', 'confidence_score'] as const).map(key => (
                <div key={key}>
                  <Label className="text-slate-400 text-xs capitalize">
                    {key.replace('_score', '')} /10
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="mt-1 bg-[#1a1a24] border-[#2a2a40] text-white"
                  />
                </div>
              ))}
            </div>

            {/* Pre-session notes */}
            <div>
              <Label className="text-slate-400 text-sm">Pre-Session Notes</Label>
              <Textarea
                value={form.pre_session_notes}
                onChange={e => setForm(f => ({ ...f, pre_session_notes: e.target.value }))}
                placeholder="How are you feeling before the session?"
                className="mt-1 bg-[#1a1a24] border-[#2a2a40] text-white min-h-[80px]"
              />
            </div>

            {/* Post-session notes */}
            <div>
              <Label className="text-slate-400 text-sm">Post-Session Notes</Label>
              <Textarea
                value={form.post_session_notes}
                onChange={e => setForm(f => ({ ...f, post_session_notes: e.target.value }))}
                placeholder="How did the session go?"
                className="mt-1 bg-[#1a1a24] border-[#2a2a40] text-white min-h-[80px]"
              />
            </div>

            {/* Lessons */}
            <div>
              <Label className="text-slate-400 text-sm">Lessons Learned</Label>
              <Textarea
                value={form.lessons_learned}
                onChange={e => setForm(f => ({ ...f, lessons_learned: e.target.value }))}
                placeholder="What did you learn today?"
                className="mt-1 bg-[#1a1a24] border-[#2a2a40] text-white"
              />
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.followed_rules}
                  onChange={e => setForm(f => ({ ...f, followed_rules: e.target.checked }))}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-slate-400 text-sm">Followed rules</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.goals_met}
                  onChange={e => setForm(f => ({ ...f, goals_met: e.target.checked }))}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-slate-400 text-sm">Goals met</span>
              </label>
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2"
            >
              Save Entry
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
