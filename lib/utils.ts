import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | null | undefined, currency = 'USD'): string {
  if (value === null || value === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0.00%'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return '0'
  return value.toFixed(decimals)
}

export function pnlColor(value: number | null | undefined): string {
  if (!value) return 'text-slate-400'
  return value > 0 ? 'text-green-400' : 'text-red-400'
}

export function pnlBg(value: number | null | undefined): string {
  if (!value) return 'bg-slate-700'
  return value > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
}

export function calculatePnL(
  side: 'long' | 'short',
  quantity: number,
  entryPrice: number,
  exitPrice: number,
  commission = 0
): { grossPnl: number; netPnl: number } {
  const grossPnl =
    side === 'long'
      ? (exitPrice - entryPrice) * quantity
      : (entryPrice - exitPrice) * quantity
  const netPnl = grossPnl - commission
  return { grossPnl, netPnl }
}

export function calculateRR(
  side: 'long' | 'short',
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): number {
  const risk = Math.abs(entryPrice - stopLoss)
  const reward = Math.abs(takeProfit - entryPrice)
  if (risk === 0) return 0
  return reward / risk
}

export function calculateRMultiple(
  side: 'long' | 'short',
  entryPrice: number,
  exitPrice: number,
  stopLoss: number
): number {
  const risk = Math.abs(entryPrice - stopLoss)
  if (risk === 0) return 0
  const pnlPerUnit =
    side === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice
  return pnlPerUnit / risk
}

export function getTradeDuration(entryDate: string, exitDate?: string | null): string {
  if (!exitDate) return 'Open'
  const entry = new Date(entryDate)
  const exit = new Date(exitDate)
  const ms = exit.getTime() - entry.getTime()
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}
