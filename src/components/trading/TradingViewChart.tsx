'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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

const intervals: { value: ChartInterval; label: string; period: string }[] = [
  { value: '1', label: '1m', period: '1 Minute' },
  { value: '5', label: '5m', period: '5 Minutes' },
  { value: '15', label: '15m', period: '15 Minutes' },
  { value: '30', label: '30m', period: '30 Minutes' },
  { value: '60', label: '1H', period: '1 Hour' },
  { value: '240', label: '4H', period: '4 Hours' },
  { value: 'D', label: '1D', period: 'Daily' },
  { value: 'W', label: '1W', period: 'Weekly' },
  { value: 'M', label: '1M', period: 'Monthly' },
]

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localInterval, setLocalInterval] = useState<ChartInterval>(propsInterval)
  const { currentSymbol } = useTrading()

  const symbol = propsSymbol || currentSymbol?.symbol || 'EURUSD'

  const loadWidget = useCallback(() => {
    if (!containerRef.current) return

    setIsLoading(true)
    setError(null)

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }
    widgetRef.current = null

    const widgetContainer = document.createElement('div')
    widgetContainer.id = 'tradingview_chart'
    widgetContainer.style.height = `${height}px`
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(widgetContainer)

    if (typeof window.TradingView !== 'undefined') {
      try {
        widgetRef.current = new window.TradingView.widget({
          container_id: 'tradingview_chart',
          symbol: symbol,
          interval: localInterval,
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#ffffff',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies',
          ],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          withdateranges: true,
          details: true,
          hotlist: true,
          calendar: false,
          studies_overrides: {
            'volume.volume.color.0': '#ef4444',
            'volume.volume.color.1': '#22c55e',
          },
          overrides: {
            'mainSeriesProperties.candleStyle.upColor': '#22c55e',
            'mainSeriesProperties.candleStyle.downColor': '#ef4444',
            'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
            'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
          },
          loading_screen: {
            backgroundColor: '#ffffff',
            foregroundColor: '#6366f1',
          },
          disabled_features: [
            'use_localstorage_for_settings',
            'header_symbol_search',
          ],
          enabled_features: [
            'study_templates',
            'hide_left_toolbar_by_default',
          ],
        })

        widgetRef.current.onChartReady(() => {
          setIsLoading(false)
        })
      } catch (err) {
        setError('Failed to load TradingView chart')
        setIsLoading(false)
      }
    } else {
      setError('TradingView library not loaded')
      setIsLoading(false)
    }
  }, [symbol, localInterval, height])

  useEffect(() => {
    loadWidget()
  }, [loadWidget])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      loadWidget()
    }
    script.onerror = () => {
      setError('Failed to load TradingView library')
      setIsLoading(false)
    }
    document.head.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      widgetRef.current = null
    }
  }, [loadWidget])

  const handleIntervalChange = (interval: ChartInterval) => {
    setLocalInterval(interval)
    if (widgetRef.current) {
      widgetRef.current.setSymbol(symbol, interval)
    }
  }

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">{symbol}</h3>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {intervals.map((int) => (
              <button
                key={int.value}
                onClick={() => handleIntervalChange(int.value)}
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded',
                  'transition-colors',
                  localInterval === int.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
                title={int.period}
              >
                {int.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadWidget()}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
            title="Refresh chart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Loading chart...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={loadWidget}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <div ref={containerRef} className="w-full" style={{ height }} />
      </div>

      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>O: 1.0852</span>
          <span>H: 1.0865</span>
          <span>L: 1.0840</span>
          <span>C: 1.0858</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>Market Open</span>
        </div>
      </div>
    </div>
  )
}
