'use client'

import { useState, useCallback } from 'react'
import { useTrading } from '@/contexts/TradingContext'
import { Button } from '@/components/ui'
import { NumberInput } from './NumberInput'
import { Select } from './Select'
import { Toggle } from './Toggle'
import { Tabs } from './Tabs'
import { cn } from '@/lib/utils'

const orderTypes = [
  { value: 'market', label: 'Market' },
  { value: 'limit', label: 'Limit' },
  { value: 'stop', label: 'Stop' },
  { value: 'stop_limit', label: 'Stop Limit' },
]

const timeInForces = [
  { value: 'gtc', label: 'GTC' },
  { value: 'day', label: 'Day' },
]

interface OrderEntryProps {
  symbol?: string
  className?: string
}

export function OrderEntry({ symbol, className }: OrderEntryProps) {
  const {
    currentSymbol,
    quote,
    submitOrder,
    submitOCOOrder,
    pendingOrder,
  } = useTrading()

  const [orderMode, setOrderMode] = useState<'simple' | 'oco'>('simple')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop' | 'stop_limit'>('market')
  const [volume, setVolume] = useState(0.01)
  const [price, setPrice] = useState<number>()
  const [stopPrice, setStopPrice] = useState<number>()
  const [sl, setSl] = useState<number>()
  const [tp, setTp] = useState<number>()
  const [useSlTp, setUseSlTp] = useState(true)
  const [timeInForce, setTimeInForce] = useState('gtc')
  const [comment, setComment] = useState('')

  const displaySymbol = symbol || currentSymbol?.symbol || 'EURUSD'
  const currentQuote = quote || { bid: 1.0850, ask: 1.0852 }

  const handleSideChange = useCallback((newSide: 'buy' | 'sell') => {
    setSide(newSide)
  }, [])

  const handleSimpleSubmit = useCallback(() => {
    submitOrder({
      symbol: displaySymbol,
      side,
      type: orderType,
      volume,
      price: orderType !== 'market' ? price : undefined,
      stopPrice: orderType === 'stop' || orderType === 'stop_limit' ? stopPrice : undefined,
      sl: useSlTp ? sl : undefined,
      tp: useSlTp ? tp : undefined,
      comment,
      timeInForce: timeInForce !== 'gtc' ? timeInForce : undefined,
    })
  }, [displaySymbol, side, orderType, volume, price, stopPrice, sl, tp, useSlTp, comment, timeInForce, submitOrder])

  const handleOCOSubmit = useCallback(() => {
    if (sl && tp) {
      submitOCOOrder({
        symbol: displaySymbol,
        side,
        volume,
        sl,
        tp,
        comment,
        timeInForce: timeInForce !== 'gtc' ? timeInForce : undefined,
      })
    }
  }, [displaySymbol, side, volume, sl, tp, comment, timeInForce, submitOCOOrder])

  const isSimpleValid = volume > 0 && (!useSlTp || (sl && tp))
  const isOCOValid = volume > 0 && sl && tp

  const modeTabs = [
    { id: 'simple', label: 'Simple' },
    { id: 'oco', label: 'OCO' },
  ]

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Order Entry</h3>
        <Tabs tabs={modeTabs} activeTab={orderMode} onChange={(id) => setOrderMode(id as 'simple' | 'oco')} variant="pills" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleSideChange('buy')}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
              side === 'buy' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Buy
          </button>
          <button
            onClick={() => handleSideChange('sell')}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
              side === 'sell' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Sell
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-600 font-mono">{currentQuote.ask.toFixed(5)}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600 font-mono">{currentQuote.bid.toFixed(5)}</span>
        </div>
      </div>

      {orderMode === 'simple' && (
        <div className="space-y-4">
          <Select
            label="Order Type"
            options={orderTypes}
            value={orderType}
            onChange={(v) => setOrderType(v as typeof orderType)}
          />

          <NumberInput
            label="Volume (Lots)"
            value={volume}
            onChange={setVolume}
            min={0.01}
            max={100}
            step={0.01}
            decimals={2}
            suffix="lots"
            variant={side === 'buy' ? 'buy' : 'sell'}
          />

          {(orderType === 'limit' || orderType === 'stop_limit') && (
            <NumberInput
              label="Limit Price"
              value={price || currentQuote.ask}
              onChange={setPrice}
              min={0}
              step={0.00001}
              decimals={5}
            />
          )}

          {(orderType === 'stop' || orderType === 'stop_limit') && (
            <NumberInput
              label="Stop Price"
              value={stopPrice || currentQuote.bid}
              onChange={setStopPrice}
              min={0}
              step={0.00001}
              decimals={5}
            />
          )}

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Stop Loss / Take Profit</span>
              <Toggle checked={useSlTp} onChange={setUseSlTp} size="sm" />
            </div>

            {useSlTp && (
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="Stop Loss"
                  value={sl || 0}
                  onChange={setSl}
                  min={0}
                  step={0.00001}
                  decimals={5}
                  variant="sell"
                />
                <NumberInput
                  label="Take Profit"
                  value={tp || 0}
                  onChange={setTp}
                  min={0}
                  step={0.00001}
                  decimals={5}
                  variant="buy"
                />
              </div>
            )}
          </div>

          <Select
            label="Time in Force"
            options={timeInForces}
            value={timeInForce}
            onChange={setTimeInForce}
          />

          <input
            type="text"
            placeholder="Comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <Button
            onClick={handleSimpleSubmit}
            disabled={!isSimpleValid || pendingOrder}
            className={cn(
              'w-full h-12 text-base font-semibold',
              side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            )}
          >
            {pendingOrder ? 'Processing...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${displaySymbol}`}
          </Button>
        </div>
      )}

      {orderMode === 'oco' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            OCO (One Cancels Other) places both Stop Loss and Take Profit orders simultaneously. When one is executed, the other is automatically cancelled.
          </p>

          <NumberInput
            label="Volume (Lots)"
            value={volume}
            onChange={setVolume}
            min={0.01}
            max={100}
            step={0.01}
            decimals={2}
            suffix="lots"
            variant={side === 'buy' ? 'buy' : 'sell'}
          />

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Stop Loss (pips)"
              value={sl || 0}
              onChange={setSl}
              min={1}
              step={1}
              decimals={0}
              variant="sell"
            />
            <NumberInput
              label="Take Profit (pips)"
              value={tp || 0}
              onChange={setTp}
              min={1}
              step={1}
              decimals={0}
              variant="buy"
            />
          </div>

          <Select
            label="Time in Force"
            options={timeInForces}
            value={timeInForce}
            onChange={setTimeInForce}
          />

          <input
            type="text"
            placeholder="Comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <Button
            onClick={handleOCOSubmit}
            disabled={!isOCOValid || pendingOrder}
            className={cn(
              'w-full h-12 text-base font-semibold',
              side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            )}
          >
            {pendingOrder ? 'Processing...' : `Place OCO ${side === 'buy' ? 'Buy' : 'Sell'}`}
          </Button>
        </div>
      )}
    </div>
  )
}
