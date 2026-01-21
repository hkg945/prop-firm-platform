'use client'

import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Target, Trophy, Zap } from 'lucide-react'
import {
  StatsCard,
  AccountStatusCard,
  DrawdownIndicator,
  TradingHistoryTable,
  PnLChart,
} from '@/components/dashboard'
import { Account, Trade, AccountStats, DashboardData } from '@/types/dashboard'
import {
  getDashboardData,
  getAccount,
  getAccountStats,
  getRecentTrades,
  getDrawdownData,
} from '@/services/dashboard'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState<Account | null>(null)
  const [stats, setStats] = useState<AccountStats | null>(null)
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [drawdownData, setDrawdownData] = useState<{
    daily: { used: number; remaining: number; percentage: number }
    max: { used: number; remaining: number; percentage: number }
  } | null>(null)
  const [pnlData, setPnlData] = useState<Array<{ date: string; pnl: number }>>([])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [accountData, statsData, tradesData, drawdown, pnl] = await Promise.all([
          getAccount(),
          getAccountStats(),
          getRecentTrades(5),
          getDrawdownData(),
          getDashboardData(),
        ])

        setAccount(accountData)
        setStats(statsData)
        setRecentTrades(tradesData)
        setDrawdownData(drawdown)
        setPnlData(pnl.dailyPnL)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!account || !stats || !drawdownData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>

      <AccountStatusCard account={account} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Equity"
          value={`$${account.equity.toLocaleString()}`}
          subtitle={`Balance: $${account.balance.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          variant="default"
        />
        <StatsCard
          title="Net Profit"
          value={account.profit >= 0 ? `+$${account.profit.toLocaleString()}` : `-$${Math.abs(account.profit).toLocaleString()}`}
          subtitle={`${account.profitPercentage >= 0 ? '+' : ''}${account.profitPercentage.toFixed(2)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          variant={account.profit >= 0 ? 'success' : 'danger'}
          trend={{ value: account.profitPercentage, label: 'from start' }}
        />
        <StatsCard
          title="Profit Target"
          value={`${((account.profit / account.profitTarget) * 100).toFixed(1)}%`}
          subtitle={`$${account.profit.toLocaleString()} / $${account.profitTarget.toLocaleString()}`}
          icon={<Target className="w-6 h-6" />}
          variant="default"
        />
        <StatsCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subtitle={`${stats.winningTrades}W / ${stats.losingTrades}L`}
          icon={<Trophy className="w-6 h-6" />}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DrawdownIndicator
          type="daily"
          used={drawdownData.daily.used}
          remaining={drawdownData.daily.remaining}
          percentage={drawdownData.daily.percentage}
          limit={account.dailyDrawdown}
        />
        <DrawdownIndicator
          type="max"
          used={drawdownData.max.used}
          remaining={drawdownData.max.remaining}
          percentage={drawdownData.max.percentage}
          limit={account.maxDrawdown}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PnLChart data={pnlData} />

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Performance Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Trades</span>
              <span className="font-medium text-gray-900">{stats.totalTrades}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Win Rate</span>
              <span className="font-medium text-gray-900">{stats.winRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Average Win</span>
              <span className="font-medium text-green-600">+${stats.averageWin.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Average Loss</span>
              <span className="font-medium text-red-600">-${Math.abs(stats.averageLoss).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Profit Factor</span>
              <span className="font-medium text-gray-900">{stats.profitFactor.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Longest Win Streak</span>
              <span className="font-medium text-green-600">{stats.longestWinningStreak} trades</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Avg Trade Duration</span>
              <span className="font-medium text-gray-900">{Math.round(stats.averageTradeDuration)} min</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Trades</h3>
          <a
            href="/dashboard/trades"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All →
          </a>
        </div>
        <TradingHistoryTable trades={recentTrades} />
      </div>
    </div>
  )
}
