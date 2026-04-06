import { MOCK_PLAYBOOKS } from '@/lib/mock-data'
import PlaybookDetailClient from './PlaybookDetailClient'

export function generateStaticParams() {
  return MOCK_PLAYBOOKS.map(p => ({ id: p.id }))
}

export default function PlaybookDetailPage() {
  return <PlaybookDetailClient />
}
