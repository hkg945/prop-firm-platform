'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Activity, CreditCard, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTrading } from '@/contexts/TradingContext'
import { OrderEntry } from '@/components/trading/OrderEntry'
import { PositionsPanel } from '@/components/trading/PositionsPanel'
import { Watchlist } from '@/components/trading/Watchlist'
import { TradingViewChart } from '@/components/trading/TradingViewChart'
import { Tabs } from '@/components/trading/Tabs'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Activity, label: 'Terminal', href: '/terminal' },
  { icon: CreditCard, label: 'Payouts', href: '/dashboard/payouts' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function TerminalPage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()
  const { positions = [], account: tradingAccount } = useTrading()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('positions')
  const [serverTime, setServerTime] = useState('--:--:--')

  const account = tradingAccount || {
    balance: 100000,
    equity: 100000,
    usedMargin: 0,
    freeMargin: 100000,
    profit: 0,
    profitPercent: 0,
    marginPercent: 0,
    totalVolume: 0,
    openPositions: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    id: 'mock-account',
    accountNumber: 'EF-MOCK-001',
    challengeType: 'Evaluation',
    phase: 'challenge'
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const updateTime = () => {
      setServerTime(new Date().toLocaleTimeString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    router.push('/')
  }, [logout, router])

  if (authLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'positions', label: 'Positions', badge: positions.length },
    { id: 'orders', label: 'Orders' },
    { id: 'history', label: 'History' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">EF</span>
              </div>
              <span className="text-lg font-bold">EdgeFlow Capital</span>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      item.href === '/terminal'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">Trading Terminal</h1>
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                DEMO
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Server Time: <span className="font-mono">{serverTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600">Connected</span>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
                <div className="lg:col-span-1 overflow-hidden">
                  <Watchlist className="h-full" />
                </div>

                <div className="lg:col-span-2 flex flex-col overflow-hidden">
                  <TradingViewChart
                    symbol="EURUSD"
                    interval="60"
                    height={400}
                    className="flex-shrink-0"
                  />

                  <div className="flex-1 overflow-hidden mt-4">
                    <div className="bg-white rounded-xl border border-gray-200 h-full overflow-hidden flex flex-col">
                      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                        <Tabs
                          tabs={tabs}
                          activeTab={activeTab}
                          onChange={setActiveTab}
                          variant="underlined"
                        />
                      </div>
                      <div className="p-4 flex-1 overflow-hidden">
                        <PositionsPanel className="h-full border-0 rounded-none shadow-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 overflow-hidden">
                  <OrderEntry className="h-full" />
                </div>
              </div>
            </div>

            <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-auto">
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Account Summary</h3>
                    <span className="px-2 py-0.5 text-xs bg-green-500 rounded">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balance</span>
                      <span className="font-mono">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Equity</span>
                      <span className="font-mono">${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Used Margin</span>
                      <span className="font-mono">${account.usedMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Free Margin</span>
                      <span className={cn(
                        'font-mono',
                        account.freeMargin > 0 ? 'text-green-400' : 'text-red-400'
                      )}>${account.freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total P/L</span>
                        <span className={cn(
                          'font-mono',
                          account.profit >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {account.profit >= 0 ? '+' : ''}${account.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Positions</p>
                      <p className="text-lg font-semibold text-gray-900">{positions.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Total P/L</p>
                      <p className={cn(
                        'text-lg font-semibold',
                        account.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {account.profit >= 0 ? '+' : ''}${account.profit.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Win Rate</p>
                      <p className="text-lg font-semibold text-gray-900">-</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Profit Factor</p>
                      <p className="text-lg font-semibold text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
