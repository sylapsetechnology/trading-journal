import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon?: LucideIcon
  prefix?: string
  suffix?: string
  className?: string
  valueClassName?: string
  isCurrency?: boolean
}

export function StatCard({
  title, value, change, icon: Icon, prefix, suffix, className, valueClassName, isCurrency
}: StatCardProps) {
  const numValue = typeof value === 'number' ? value : parseFloat(String(value))
  const isPositive = numValue >= 0
  const formattedValue = isCurrency ? formatCurrency(numValue) : value

  return (
    <div className={cn(
      'bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-5 hover:border-indigo-600/30 transition-colors',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-indigo-400" />
          </div>
        )}
      </div>
      <div className={cn(
        'text-2xl font-bold',
        isCurrency && numValue !== 0 ? (isPositive ? 'text-green-400' : 'text-red-400') : 'text-white',
        valueClassName
      )}>
        {prefix}{formattedValue}{suffix}
      </div>
      {change !== undefined && (
        <div className={cn(
          'text-sm mt-1 font-medium',
          change >= 0 ? 'text-green-400' : 'text-red-400'
        )}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs last period
        </div>
      )}
    </div>
  )
}
