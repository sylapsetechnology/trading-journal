export type AssetType = 'stocks' | 'forex' | 'crypto' | 'futures' | 'options'
export type TradeSide = 'long' | 'short'
export type TradeStatus = 'open' | 'closed' | 'partial'
export type EmotionType = 'calm' | 'anxious' | 'confident' | 'fearful' | 'greedy'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  timezone: string
  currency: string
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  broker: string | null
  asset_type: AssetType
  initial_balance: number
  currency: string
  is_default: boolean
  created_at: string
}

export interface Playbook {
  id: string
  user_id: string
  name: string
  description: string | null
  asset_type: string | null
  timeframe: string | null
  market_conditions: string | null
  entry_rules: string[]
  exit_rules: string[]
  risk_rules: string[]
  notes: string | null
  color: string
  is_active: boolean
  created_at: string
}

export interface Trade {
  id: string
  user_id: string
  account_id: string | null
  symbol: string
  asset_type: AssetType
  side: TradeSide
  quantity: number
  entry_price: number
  exit_price: number | null
  entry_date: string
  exit_date: string | null
  stop_loss: number | null
  take_profit: number | null
  commission: number
  gross_pnl: number | null
  net_pnl: number | null
  r_multiple: number | null
  status: TradeStatus
  setup: string | null
  playbook_id: string | null
  notes: string | null
  emotion_before: EmotionType | null
  emotion_after: EmotionType | null
  mistake_tags: string[]
  is_backtested: boolean
  created_at: string
  updated_at: string
  // joined
  playbook?: Playbook
}

export interface PsychologyEntry {
  id: string
  user_id: string
  date: string
  mood_score: number | null
  energy_score: number | null
  confidence_score: number | null
  pre_session_notes: string | null
  post_session_notes: string | null
  lessons_learned: string | null
  goals_met: boolean | null
  followed_rules: boolean | null
  created_at: string
}

// Analytics types
export interface TradeStats {
  totalPnl: number
  winRate: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  avgWin: number
  avgLoss: number
  avgRR: number
  profitFactor: number
  maxDrawdown: number
  bestTrade: number
  worstTrade: number
  avgRMultiple: number
  consecutiveWins: number
  consecutiveLosses: number
}

export interface DailyPnL {
  date: string
  pnl: number
  trades: number
}

export interface EquityPoint {
  date: string
  equity: number
  pnl: number
}

export interface DrawdownPoint {
  date: string
  drawdown: number
  equity: number
}

export interface SetupStats {
  setup: string
  trades: number
  winRate: number
  avgPnl: number
  totalPnl: number
}

export interface PlaybookStats {
  playbook: string
  color: string
  trades: number
  winRate: number
  avgPnl: number
  totalPnl: number
  bestTrade: number
}

// Form types
export interface TradeFormData {
  symbol: string
  asset_type: AssetType
  side: TradeSide
  account_id: string
  quantity: number
  entry_price: number
  exit_price?: number
  entry_date: string
  exit_date?: string
  stop_loss?: number
  take_profit?: number
  commission: number
  playbook_id?: string
  setup?: string
  emotion_before?: EmotionType
  emotion_after?: EmotionType
  mistake_tags: string[]
  notes?: string
}

export interface PlaybookFormData {
  name: string
  description?: string
  asset_type?: string
  timeframe?: string
  market_conditions?: string
  entry_rules: string[]
  exit_rules: string[]
  risk_rules: string[]
  notes?: string
  color: string
}

export interface PeriodFilter {
  label: string
  value: string
  days: number | null
}

export const PERIOD_FILTERS: PeriodFilter[] = [
  { label: '1W', value: '1w', days: 7 },
  { label: '1M', value: '1m', days: 30 },
  { label: '3M', value: '3m', days: 90 },
  { label: 'YTD', value: 'ytd', days: null },
  { label: 'ALL', value: 'all', days: null },
]

export const SETUP_TAGS = [
  'Breakout', 'Pullback', 'VWAP', 'Gap Fill', 'Reversal',
  'Trend Follow', 'Scalp', 'Swing', 'Momentum', 'Mean Revert',
  'Support/Resistance', 'Earnings', 'News Play', 'Opening Range',
]

export const MISTAKE_TAGS = [
  { value: 'early_exit', label: 'Sortie trop tôt' },
  { value: 'oversize', label: 'Trop grosse position' },
  { value: 'fomo', label: 'FOMO' },
  { value: 'revenge', label: 'Revanche' },
  { value: 'missed_entry', label: "Raté l'entry" },
  { value: 'no_sl', label: 'Pas respecté SL' },
]

export const EMOTIONS = [
  { value: 'calm', label: 'Calme', emoji: '😌' },
  { value: 'anxious', label: 'Anxieux', emoji: '😰' },
  { value: 'confident', label: 'Confiant', emoji: '💪' },
  { value: 'fearful', label: 'Effrayé', emoji: '😨' },
  { value: 'greedy', label: 'Greedy', emoji: '🤑' },
]
