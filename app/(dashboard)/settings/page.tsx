'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { MOCK_ACCOUNT } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { CheckCircle2, Trash2, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

function SavedBadge({ saved }: { saved: boolean }) {
  if (!saved) return null
  return (
    <span className="flex items-center gap-1 text-green-400 text-sm animate-pulse">
      <CheckCircle2 className="w-4 h-4" />
      Saved
    </span>
  )
}

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']

export default function SettingsPage() {
  // Profile
  const [profile, setProfile] = useState({
    name: 'Jordan Ouaki',
    email: 'jordan@sylapse.com',
    timezone: 'Europe/Paris',
    currency: 'USD',
  })
  const [profileSaved, setProfileSaved] = useState(false)

  // Account
  const [account, setAccount] = useState({
    name: MOCK_ACCOUNT.name,
    broker: MOCK_ACCOUNT.broker ?? '',
    asset_type: MOCK_ACCOUNT.asset_type,
    initial_balance: MOCK_ACCOUNT.initial_balance.toString(),
  })
  const [accountSaved, setAccountSaved] = useState(false)

  // Preferences
  const [prefs, setPrefs] = useState({
    theme: 'dark' as 'dark' | 'light',
    currency_display: 'symbol' as 'symbol' | 'code',
  })
  const [prefsSaved, setPrefsSaved] = useState(false)

  // Danger zone
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const saveProfile = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const saveAccount = () => {
    setAccountSaved(true)
    setTimeout(() => setAccountSaved(false), 2500)
  }

  const savePrefs = () => {
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2500)
  }

  const confirmDelete = () => {
    setDeleteDialog(false)
    setDeleted(true)
  }

  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-6 space-y-6 max-w-2xl">

        {/* Profile Section */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Profile</h2>
            <SavedBadge saved={profileSaved} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400 text-sm">Full Name</Label>
              <Input
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Timezone</Label>
              <Select value={profile.timezone} onValueChange={v => setProfile(p => ({ ...p, timezone: v }))}>
                <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                  {TIMEZONES.map(tz => (
                    <SelectItem key={tz} value={tz} className="text-slate-300">{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Currency</Label>
              <Select value={profile.currency} onValueChange={v => setProfile(p => ({ ...p, currency: v }))}>
                <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                  {CURRENCIES.map(c => (
                    <SelectItem key={c} value={c} className="text-slate-300">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Save Profile
          </Button>
        </div>

        {/* Account Section */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Trading Account</h2>
            <SavedBadge saved={accountSaved} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400 text-sm">Account Name</Label>
              <Input
                value={account.name}
                onChange={e => setAccount(a => ({ ...a, name: e.target.value }))}
                className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Broker</Label>
              <Input
                value={account.broker}
                onChange={e => setAccount(a => ({ ...a, broker: e.target.value }))}
                className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Asset Type</Label>
              <Select value={account.asset_type} onValueChange={v => setAccount(a => ({ ...a, asset_type: v as any }))}>
                <SelectTrigger className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a24] border-[#2a2a40]">
                  {['stocks', 'forex', 'crypto', 'futures', 'options'].map(t => (
                    <SelectItem key={t} value={t} className="text-slate-300 capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Initial Balance ($)</Label>
              <Input
                type="number"
                value={account.initial_balance}
                onChange={e => setAccount(a => ({ ...a, initial_balance: e.target.value }))}
                className="mt-1 bg-[#0f0f13] border-[#2a2a40] text-white"
              />
            </div>
          </div>

          <Button onClick={saveAccount} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Save Account
          </Button>
        </div>

        {/* Preferences */}
        <div className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Preferences</h2>
            <SavedBadge saved={prefsSaved} />
          </div>

          {/* Theme Toggle */}
          <div>
            <Label className="text-slate-400 text-sm block mb-2">Theme</Label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setPrefs(p => ({ ...p, theme: t }))}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm',
                    prefs.theme === t
                      ? 'border-indigo-600 bg-indigo-600/10 text-indigo-400'
                      : 'border-[#2a2a40] text-slate-400 hover:text-white'
                  )}
                >
                  {t === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Display */}
          <div>
            <Label className="text-slate-400 text-sm block mb-2">Currency Display</Label>
            <div className="flex gap-2">
              {(['symbol', 'code'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setPrefs(p => ({ ...p, currency_display: c }))}
                  className={cn(
                    'px-4 py-2 rounded-lg border transition-all text-sm',
                    prefs.currency_display === c
                      ? 'border-indigo-600 bg-indigo-600/10 text-indigo-400'
                      : 'border-[#2a2a40] text-slate-400 hover:text-white'
                  )}
                >
                  {c === 'symbol' ? '$ Symbol' : 'USD Code'}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={savePrefs} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Save Preferences
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1a1a24] border border-red-500/30 rounded-xl p-6 space-y-3">
          <h2 className="text-red-400 font-semibold">Danger Zone</h2>
          <p className="text-slate-500 text-sm">This action cannot be undone. All your trades will be permanently deleted.</p>

          {deleted ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              All trades deleted (simulated).
            </div>
          ) : (
            <Button
              onClick={() => setDeleteDialog(true)}
              variant="outline"
              className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Trades
            </Button>
          )}
        </div>

      </div>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="bg-[#1a1a24] border-[#2a2a40] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Delete All Trades?</DialogTitle>
            <DialogDescription className="text-slate-400">
              This will permanently delete all your trade records. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              className="border-[#2a2a40] text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Yes, delete all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
