'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/Topbar'
import { TradeForm } from '@/components/journal/TradeForm'
import { MOCK_PLAYBOOKS, MOCK_ACCOUNT } from '@/lib/mock-data'

export default function NewTradePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    // In real app: save to Supabase
    console.log('Trade data:', data)
    await new Promise(r => setTimeout(r, 800))
    router.push('/journal')
  }

  return (
    <div>
      <Topbar title="New Trade" />
      <div className="p-6 max-w-2xl">
        <TradeForm
          playbooks={MOCK_PLAYBOOKS}
          accounts={[MOCK_ACCOUNT]}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}
