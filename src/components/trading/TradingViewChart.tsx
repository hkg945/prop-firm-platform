'use client'

import { useEffect, useRef } from 'react'
import { useTrading } from '@/contexts/TradingContext'
import { ChartInterval } from '@/types/trading'
import { cn } from '@/lib/utils'

interface TradingViewChartProps {
  symbol?: string
  interval?: ChartInterval
  height?: number
  className?: string
  onSymbolChange?: (symbol: string) => void
}

declare global {
  interface Window {
    TradingView: any
  }
}

export function TradingViewChart({
  symbol: propsSymbol,
  interval: propsInterval = '60',
  height = 500,
  className,
  onSymbolChange
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const { currentSymbol: contextSymbol } = useTrading()
  const currentSymbol = propsSymbol || contextSymbol?.symbol || 'EURUSD'
  
  // Convert our interval to TradingView format
  const getTvInterval = (interval: string) => {
    if (interval === '60') return '60'
    if (interval === '240') return '240'
    return interval
  }

  useEffect(() => {
    // Load TradingView Script
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        let tvSymbol = currentSymbol
        
        // Handle Symbol Mapping for TradingView
        if (!tvSymbol.includes(':')) {
           // Crypto: Use Binance for best sync with our backend WS
           if (['BTCUSD', 'ETHUSD', 'XRPUSD', 'SOLUSD', 'BTCUSDT', 'ETHUSDT'].some(s => currentSymbol.includes(s))) {
             const clean = currentSymbol.endsWith('USDT') ? currentSymbol : currentSymbol.replace('USD', 'USDT')
             tvSymbol = `BINANCE:${clean}`
           } else {
             // Forex: Use FXCM or OANDA for standard feeds
             tvSymbol = `FX:${currentSymbol}`
           }
        }

        widgetRef.current = new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: tvSymbol,
          interval: getTvInterval(propsInterval),
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          autosize: true,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies'
          ]
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (widgetRef.current) {
        widgetRef.current = null
      }
    }
  }, [currentSymbol, propsInterval])

  return (
    <div 
      className={cn('w-full bg-white rounded-xl border border-gray-200 overflow-hidden', className)}
      style={{ height }}
    >
      <div id="tradingview_widget" ref={containerRef} className="w-full h-full" />
    </div>
  )
}
