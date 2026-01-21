'use client'

import { cn } from '@/lib/utils'

interface DrawdownIndicatorProps {
  type: 'daily' | 'max'
  used: number
  remaining: number
  percentage: number
  limit: number
}

export function DrawdownIndicator({
  type,
  used,
  remaining,
  percentage,
  limit,
}: DrawdownIndicatorProps) {
  const label = type === 'daily' ? 'Daily Drawdown' : 'Max Drawdown'
  const colorClass =
    percentage > 80
      ? 'bg-red-500'
      : percentage > 60
      ? 'bg-amber-500'
      : 'bg-green-500'

  const textColorClass =
    percentage > 80
      ? 'text-red-600'
      : percentage > 60
      ? 'text-amber-600'
      : 'text-green-600'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        <span className="text-sm text-gray-500">Limit: {limit}%</span>
      </div>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-1">
          <span className="text-sm text-gray-500">Used</span>
          <span className={cn('text-lg font-bold', textColorClass)}>
            {percentage.toFixed(2)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-300', colorClass)}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Used Amount</p>
          <p className={cn('font-semibold', textColorClass)}>${used.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Remaining</p>
          <p className="font-semibold text-gray-900">${remaining.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
