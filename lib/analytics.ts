import { Trade, TradeStats, DailyPnL, EquityPoint, DrawdownPoint, SetupStats } from '@/types'
import { format, eachDayOfInterval, subDays } from 'date-fns'

export function computeStats(trades: Trade[]): TradeStats {
  const closed = trades.filter(t => t.status === 'closed' && t.net_pnl !== null)
  if (closed.length === 0) {
    return {
      totalPnl: 0, winRate: 0, totalTrades: 0, winningTrades: 0, losingTrades: 0,
      avgWin: 0, avgLoss: 0, avgRR: 0, profitFactor: 0, maxDrawdown: 0,
      bestTrade: 0, worstTrade: 0, avgRMultiple: 0, consecutiveWins: 0, consecutiveLosses: 0,
    }
  }

  const winners = closed.filter(t => (t.net_pnl ?? 0) > 0)
  const losers = closed.filter(t => (t.net_pnl ?? 0) <= 0)
  const totalPnl = closed.reduce((sum, t) => sum + (t.net_pnl ?? 0), 0)
  const grossWins = winners.reduce((sum, t) => sum + (t.net_pnl ?? 0), 0)
  const grossLosses = Math.abs(losers.reduce((sum, t) => sum + (t.net_pnl ?? 0), 0))
  const pnls = closed.map(t => t.net_pnl ?? 0)
  const rMultiples = closed.filter(t => t.r_multiple !== null).map(t => t.r_multiple ?? 0)

  // Max drawdown
  let peak = 0, equity = 0, maxDrawdown = 0
  for (const t of closed.sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime())) {
    equity += t.net_pnl ?? 0
    if (equity > peak) peak = equity
    const dd = peak - equity
    if (dd > maxDrawdown) maxDrawdown = dd
  }

  // Consecutive wins/losses
  let maxConsecWins = 0, maxConsecLosses = 0, curWins = 0, curLosses = 0
  for (const t of closed) {
    if ((t.net_pnl ?? 0) > 0) { curWins++; curLosses = 0 }
    else { curLosses++; curWins = 0 }
    maxConsecWins = Math.max(maxConsecWins, curWins)
    maxConsecLosses = Math.max(maxConsecLosses, curLosses)
  }

  return {
    totalPnl,
    winRate: (winners.length / closed.length) * 100,
    totalTrades: closed.length,
    winningTrades: winners.length,
    losingTrades: losers.length,
    avgWin: winners.length > 0 ? grossWins / winners.length : 0,
    avgLoss: losers.length > 0 ? -(grossLosses / losers.length) : 0,
    avgRR: winners.length > 0 && losers.length > 0 ? (grossWins / winners.length) / (grossLosses / losers.length) : 0,
    profitFactor: grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0,
    maxDrawdown,
    bestTrade: Math.max(...pnls, 0),
    worstTrade: Math.min(...pnls, 0),
    avgRMultiple: rMultiples.length > 0 ? rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length : 0,
    consecutiveWins: maxConsecWins,
    consecutiveLosses: maxConsecLosses,
  }
}

export function computeDailyPnL(trades: Trade[], days = 30): DailyPnL[] {
  const end = new Date()
  const start = subDays(end, days)
  const range = eachDayOfInterval({ start, end })

  return range.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const dayTrades = trades.filter(t => {
      const tDate = t.exit_date ? format(new Date(t.exit_date), 'yyyy-MM-dd') : null
      return tDate === dateStr && t.status === 'closed'
    })
    return {
      date: dateStr,
      pnl: dayTrades.reduce((sum, t) => sum + (t.net_pnl ?? 0), 0),
      trades: dayTrades.length,
    }
  })
}

export function computeEquityCurve(trades: Trade[], initialBalance = 50000): EquityPoint[] {
  const closed = trades
    .filter(t => t.status === 'closed' && t.exit_date)
    .sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime())

  let equity = initialBalance
  const points: EquityPoint[] = [{ date: format(subDays(new Date(), closed.length), 'yyyy-MM-dd'), equity, pnl: 0 }]

  for (const t of closed) {
    const pnl = t.net_pnl ?? 0
    equity += pnl
    points.push({
      date: format(new Date(t.exit_date!), 'yyyy-MM-dd'),
      equity,
      pnl,
    })
  }
  return points
}

export function computeDrawdown(trades: Trade[], initialBalance = 50000): DrawdownPoint[] {
  const closed = trades
    .filter(t => t.status === 'closed' && t.exit_date)
    .sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime())

  let equity = initialBalance, peak = initialBalance
  const points: DrawdownPoint[] = []

  for (const t of closed) {
    equity += t.net_pnl ?? 0
    if (equity > peak) peak = equity
    points.push({
      date: format(new Date(t.exit_date!), 'yyyy-MM-dd'),
      drawdown: -((peak - equity) / peak * 100),
      equity,
    })
  }
  return points
}

export function computeSetupStats(trades: Trade[]): SetupStats[] {
  const closed = trades.filter(t => t.status === 'closed' && t.setup)
  const setupMap: Record<string, Trade[]> = {}
  for (const t of closed) {
    const s = t.setup!
    if (!setupMap[s]) setupMap[s] = []
    setupMap[s].push(t)
  }

  return Object.entries(setupMap).map(([setup, ts]) => {
    const winners = ts.filter(t => (t.net_pnl ?? 0) > 0)
    const totalPnl = ts.reduce((sum, t) => sum + (t.net_pnl ?? 0), 0)
    return {
      setup,
      trades: ts.length,
      winRate: (winners.length / ts.length) * 100,
      avgPnl: totalPnl / ts.length,
      totalPnl,
    }
  }).sort((a, b) => b.totalPnl - a.totalPnl)
}

export function computePnLByDayOfWeek(trades: Trade[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const map: Record<number, number[]> = {}
  for (let i = 0; i < 7; i++) map[i] = []

  for (const t of trades.filter(t => t.status === 'closed' && t.exit_date)) {
    const dow = new Date(t.exit_date!).getDay()
    map[dow].push(t.net_pnl ?? 0)
  }

  return days.map((day, i) => ({
    day,
    pnl: map[i].reduce((a, b) => a + b, 0),
    trades: map[i].length,
  }))
}

export function computePnLByHour(trades: Trade[]) {
  const map: Record<number, number[]> = {}
  for (let i = 0; i < 24; i++) map[i] = []

  for (const t of trades.filter(t => t.status === 'closed' && t.entry_date)) {
    const hour = new Date(t.entry_date).getHours()
    map[hour].push(t.net_pnl ?? 0)
  }

  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    pnl: map[i].reduce((a, b) => a + b, 0),
    trades: map[i].length,
  })).filter(h => h.trades > 0)
}

export function computeMonthlyPerformance(trades: Trade[]) {
  const map: Record<string, number> = {}
  for (const t of trades.filter(t => t.status === 'closed' && t.exit_date)) {
    const month = format(new Date(t.exit_date!), 'MMM yyyy')
    map[month] = (map[month] ?? 0) + (t.net_pnl ?? 0)
  }
  return Object.entries(map).map(([month, pnl]) => ({ month, pnl }))
}

export function filterTradesByPeriod(trades: Trade[], period: string): Trade[] {
  const now = new Date()
  if (period === 'all') return trades
  if (period === 'ytd') {
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    return trades.filter(t => new Date(t.entry_date) >= startOfYear)
  }
  const days = period === '1w' ? 7 : period === '1m' ? 30 : 90
  const cutoff = subDays(now, days)
  return trades.filter(t => new Date(t.entry_date) >= cutoff)
}
