'use client'

import { useState, useCallback } from 'react'
import { Pencil, X, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import { useTrading } from '@/contexts/TradingContext'
import { Button } from '@/components/ui'
import { Position, OrderSide, PositionSide } from '@/types/trading'
import { cn } from '@/lib/utils'

interface PositionsPanelProps {
  className?: string
}

export function PositionsPanel({ className }: PositionsPanelProps) {
  const { state, closePosition, modifyPosition } = useTrading()
  const { positions = [], currentSymbol } = state

  console.log('PositionsPanel - positions:', positions)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editSl, setEditSl] = useState<number>(0)
  const [editTp, setEditTp] = useState<number>(0)

  const handleEdit = useCallback((position: Position) => {
    setEditingId(position.id)
    setEditSl(position.sl || 0)
    setEditTp(position.tp || 0)
  }, [])

  const handleSave = useCallback((position: Position) => {
    modifyPosition(position.id, { sl: editSl || undefined, tp: editTp || undefined })
    setEditingId(null)
  }, [editSl, editTp, modifyPosition])

  const handleClose = useCallback((position: Position) => {
    closePosition(position.id)
  }, [closePosition])

  const isSelected = (symbol: string) => symbol === currentSymbol?.symbol

  if (positions.length === 0) {
    return (
      <div className={cn('bg-white rounded-xl border border-gray-200 p-6 text-center', className)}>
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No open positions</p>
        <p className="text-sm text-gray-400 mt-1">Place your first trade from the order panel</p>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full', className)}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-gray-900">Positions ({positions.length})</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="divide-y divide-gray-100 flex-1 overflow-auto">
        {positions.map((position) => {
          const isLong = position.side === 'long'
          const isProfitable = position.profit >= 0

          return (
            <div
              key={position.id}
              className={cn(
                'p-4 hover:bg-gray-50 transition-colors',
                isSelected(position.symbol) && 'bg-primary-50'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{position.symbol}</span>
                  <span className={cn(
                    'px-1.5 py-0.5 text-xs font-medium rounded',
                    isLong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  )}>
                    {isLong ? 'LONG' : 'SHORT'}
                  </span>
                </div>
                <div className={cn(
                  'flex items-center gap-1 font-semibold',
                  isProfitable ? 'text-green-600' : 'text-red-600'
                )}>
                  {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  ${position.profit.toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between text-gray-500 mb-1">
                    <span>Volume</span>
                    <span className="text-gray-900">{position.volume.toFixed(2)} lots</span>
                  </div>
                  <div className="flex justify-between text-gray-500 mb-1">
                    <span>Open Price</span>
                    <span className="text-gray-900">{position.openPrice.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Current</span>
                    <span className="text-gray-900">{position.currentPrice.toFixed(5)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-gray-500 mb-1">
                    <span>SL</span>
                    <span className={position.sl ? 'text-gray-900' : 'text-gray-400'}>
                      {position.sl?.toFixed(5) || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 mb-1">
                    <span>TP</span>
                    <span className={position.tp ? 'text-gray-900' : 'text-gray-400'}>
                      {position.tp?.toFixed(5) || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Margin</span>
                    <span className="text-gray-900">${position.margin.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {editingId === position.id ? (
                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Stop Loss"
                    value={editSl || ''}
                    onChange={(e) => setEditSl(parseFloat(e.target.value) || 0)}
                    className="px-2 py-1 text-sm border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Take Profit"
                    value={editTp || ''}
                    onChange={(e) => setEditTp(parseFloat(e.target.value) || 0)}
                    className="px-2 py-1 text-sm border rounded"
                  />
                  <Button size="sm" onClick={() => handleSave(position)} className="col-span-2">
                    Apply Changes
                  </Button>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(position)}
                    className="flex-1"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Modify
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClose(position)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Close
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
