'use client'

import { useState, useCallback } from 'react'
import { Star, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useTrading } from '@/contexts/TradingContext'
import { Symbol } from '@/types/trading'
import { cn } from '@/lib/utils'

interface WatchlistProps {
  className?: string
}

export function Watchlist({ className }: WatchlistProps) {
  const { symbols, quotes, selectSymbol, currentSymbol } = useTrading()
  const [sortBy, setSortBy] = useState<'symbol' | 'change' | 'volume'>('symbol')
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = useCallback((symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }, [])

  const displayedSymbols = symbols.filter(s => s.isAvailable)

  const getQuote = (symbol: string): WatchlistItem | null => {
    return quotes[symbol] || null
  }

  const sortedSymbols = [...displayedSymbols].sort((a, b) => {
    if (sortBy === 'change') {
      const quoteA = getQuote(a.symbol)
      const quoteB = getQuote(b.symbol)
      if (quoteA && quoteB) {
        return quoteB.changePercent - quoteA.changePercent
      }
    }
    return a.symbol.localeCompare(b.symbol)
  })

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Market Watch</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('change')}
            className={cn(
              'px-2 py-1 text-xs rounded',
              sortBy === 'change' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            % Change
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500">
        <div className="col-span-1"></div>
        <div className="col-span-3">Symbol</div>
        <div className="col-span-3 text-right">Bid</div>
        <div className="col-span-3 text-right">Ask</div>
        <div className="col-span-2 text-right">Change</div>
      </div>

      <div className="divide-y divide-gray-100 max-h-[500px] overflow-auto">
        {sortedSymbols.map((symbol) => {
          const quote = getQuote(symbol.symbol)
          const isSelected = symbol.symbol === currentSymbol?.symbol
          const isFavorite = favorites.includes(symbol.symbol)
          const change = quote?.changePercent || 0

          return (
            <div
              key={symbol.id}
              onClick={() => selectSymbol(symbol)}
              className={cn(
                'grid grid-cols-12 px-4 py-2 items-center cursor-pointer',
                'hover:bg-gray-50 transition-colors',
                isSelected && 'bg-primary-50'
              )}
            >
              <div className="col-span-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(symbol.symbol)
                  }}
                  className={cn(
                    'p-1 rounded hover:bg-gray-200',
                    isFavorite ? 'text-yellow-500' : 'text-gray-300'
                  )}
                >
                  <Star className="w-3 h-3" />
                </button>
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">{symbol.symbol}</span>
                  <span className="text-xs text-gray-400">{symbol.type}</span>
                </div>
              </div>
              <div className="col-span-3 text-right font-mono">
                <span className="text-gray-900">
                  {(quote?.bid || symbol.pipSize).toFixed(5)}
                </span>
              </div>
              <div className="col-span-3 text-right font-mono">
                <span className="text-gray-900">
                  {(quote?.ask || symbol.pipSize + symbol.tickSize).toFixed(5)}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className={cn(
                  'inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded',
                  change > 0 ? 'bg-green-100 text-green-700' :
                  change < 0 ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                )}>
                  {change > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> :
                   change < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : null}
                  {change > 0 ? '+' : ''}{change.toFixed(2)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500">
          {displayedSymbols.length} instruments available
        </p>
      </div>
    </div>
  )
}
