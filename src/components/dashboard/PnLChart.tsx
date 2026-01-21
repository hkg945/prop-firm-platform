'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface PnLChartProps {
  data: Array<{ date: string; pnl: number }>
}

export function PnLChart({ data }: PnLChartProps) {
  const maxPnL = useMemo(() => Math.max(...data.map((d) => Math.abs(d.pnl))), [data])
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return sorted
  }, [data])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Daily P&L</h3>
      <div className="h-48 flex items-end space-x-2">
        {chartData.map((item, index) => {
          const height = maxPnL > 0 ? (Math.abs(item.pnl) / maxPnL) * 100 : 0
          const isPositive = item.pnl >= 0
          const isToday = index === chartData.length - 1

          return (
            <div key={item.date} className="flex-1 flex flex-col items-center">
              <div
                className={cn(
                  'w-full rounded-t transition-all duration-300',
                  isPositive ? 'bg-green-500' : 'bg-red-500',
                  isToday && 'ring-2 ring-primary-500'
                )}
                style={{ height: `${Math.max(height, 2)}%` }}
                title={`${item.date}: ${item.pnl >= 0 ? '+' : ''}$${item.pnl.toFixed(2)}`}
              />
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center">
                {formatDate(item.date)}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-green-500 mr-2" />
          <span className="text-sm text-gray-600">Profit</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-red-500 mr-2" />
          <span className="text-sm text-gray-600">Loss</span>
        </div>
      </div>
    </div>
  )
}
