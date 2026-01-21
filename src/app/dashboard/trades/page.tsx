'use client'

import { useState } from 'react'
import { TradingHistoryTable } from '@/components/dashboard'
import { getTrades } from '@/services/dashboard'
import { useEffect } from 'react'
import { Trade } from '@/types/dashboard'

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function loadTrades() {
      setLoading(true)
      const result = await getTrades(page, 15)
      setTrades(result.data)
      setTotalPages(result.totalPages)
      setLoading(false)
    }
    loadTrades()
  }, [page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Trading History</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <TradingHistoryTable
          trades={trades}
          showPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
