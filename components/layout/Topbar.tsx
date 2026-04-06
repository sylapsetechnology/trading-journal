'use client'

import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TopbarProps {
  title?: string
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="h-16 bg-[#1a1a24] border-b border-[#2a2a40] flex items-center justify-between px-6">
      <div>
        {title && <h1 className="text-white font-semibold text-lg">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/journal/new">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Trade
          </Button>
        </Link>
        <button className="text-slate-400 hover:text-white w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">TJ</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
