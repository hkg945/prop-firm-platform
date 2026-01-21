'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Clock, Calendar, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui'
import { Tabs } from './Tabs'
import { cn, formatCurrency } from '@/lib/utils'

interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: string
  volume: number
  openPrice: number
  closePrice?: number
  sl?: number
  tp?: number
  commission: number
  swap: number
  profit?: number
  pips?: number
  durationSeconds?: number
  openedAt: string
  closedAt?: string
}

interface TradeStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalProfit: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  largestWin: number
  largestLoss: number
  averageTradeDuration: number
}

interface TradeHistoryProps {
  className?: string
}

export function TradeHistory({ className }: TradeHistoryProps) {
  const { user } = useAuth()
  const [trades, setTrades] = useState<Trade[]>([])
  const [stats, setStats] = useState<TradeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1'

  const loadTrades = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/positions/trades/history?limit=${limit}&offset=${(page - 1) * limit}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setTrades(data.data.trades)
        setTotalPages(Math.ceil(data.data.trades.length / limit) || 1)
      }
    } catch (error) {
      console.error('Failed to load trades:', error)
    } finally {
      setLoading(false)
    }
  }, [API_URL, page])

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/positions/trades/stats`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }, [API_URL])

  useEffect(() => {
    loadTrades()
    loadStats()
  }, [loadTrades, loadStats])

  const tabs = [
    { id: 'all', label: 'All Trades' },
    { id: 'winning', label: 'Winners' },
    { id: 'losing', label: 'Losers' },
  ]

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const filteredTrades = trades.filter((trade) => {
    if (activeTab === 'all') return true
    if (activeTab === 'winning') return trade.profit && trade.profit > 0
    if (activeTab === 'losing') return trade.profit && trade.profit < 0
    return true
  })

  if (loading) {
    return (
      <div className={cn('bg-white rounded-xl border border-gray-200 p-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200', className)}>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Trade History</h3>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className={cn('text-lg font-semibold', stats.winRate >= 50 ? 'text-green-600' : 'text-red-600')}>
                {stats.winRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Profit Factor</p>
              <p className={cn('text-lg font-semibold', stats.profitFactor >= 1 ? 'text-green-600' : 'text-red-600')}>
                {stats.profitFactor.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total P/L</p>
              <p className={cn('text-lg font-semibold', stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(stats.totalProfit)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Trades</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalTrades}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-b border-gray-100">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="underlined" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Open</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Close</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pips</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  No trades found
                </td>
              </tr>
            ) : (
              filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded',
                        trade.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}>
                        {trade.side.toUpperCase()}
                      </span>
                      <span className="font-medium text-gray-900">{trade.symbol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {trade.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {trade.volume.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    {trade.openPrice.toFixed(5)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    {trade.closePrice?.toFixed(5) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {trade.profit !== undefined && (
                      <span className={cn(
                        'font-medium',
                        trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {trade.pips !== undefined && (
                      <span className={cn(
                        'font-medium',
                        trade.pips >= 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {trade.pips >= 0 ? '+' : ''}{trade.pips.toFixed(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatDuration(trade.durationSeconds)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {trade.closedAt ? formatDate(trade.closedAt) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
