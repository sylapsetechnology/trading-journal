import { MOCK_TRADES } from '@/lib/mock-data'
import TradeDetailClient from './TradeDetailClient'

export function generateStaticParams() {
  return MOCK_TRADES.map(t => ({ id: t.id }))
}

export default function TradeDetailPage() {
  return <TradeDetailClient />
}
