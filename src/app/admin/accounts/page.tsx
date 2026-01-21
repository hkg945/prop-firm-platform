'use client'

import { useEffect, useState } from 'react'
import { AdminAccount, PHASE_LABELS, PHASE_OPTIONS } from '@/types/admin'
import { getAccounts, changeAccountPhase } from '@/services/admin'
import { cn } from '@/lib/utils'
import { Search, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [showPhaseModal, setShowPhaseModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AdminAccount | null>(null)
  const [newPhase, setNewPhase] = useState('')
  const [phaseReason, setPhaseReason] = useState('')

  useEffect(() => {
    async function loadAccounts() {
      setLoading(true)
      const result = await getAccounts(page, 10)
      setAccounts(result.data)
      setTotalPages(result.totalPages)
      setLoading(false)
    }
    loadAccounts()
  }, [page])

  const handleChangePhase = async () => {
    if (!selectedAccount || !newPhase) return
    try {
      await changeAccountPhase(selectedAccount.id, newPhase, phaseReason)
      setShowPhaseModal(false)
      setSelectedAccount(null)
      setNewPhase('')
      setPhaseReason('')
      const result = await getAccounts(page, 10)
      setAccounts(result.data)
    } catch (error) {
      console.error('Failed to change phase:', error)
    }
  }

  const openPhaseModal = (account: AdminAccount) => {
    setSelectedAccount(account)
    setNewPhase(account.phase)
    setShowPhaseModal(true)
  }

  const getPhaseBadge = (phase: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      challenge_1: { bg: 'bg-blue-100', text: 'text-blue-700' },
      challenge_2: { bg: 'bg-purple-100', text: 'text-purple-700' },
      funded: { bg: 'bg-green-100', text: 'text-green-700' },
      breached: { bg: 'bg-red-100', text: 'text-red-700' },
      completed: { bg: 'bg-amber-100', text: 'text-amber-700' },
    }
    const style = styles[phase] || styles.challenge_1
    return (
      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', style.bg, style.text)}>
        {PHASE_LABELS[phase as keyof typeof PHASE_LABELS] || phase}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Phases</option>
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phase</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Drawdown</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{account.accountNumber}</p>
                      <p className="text-sm text-gray-500">User: {account.userId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{account.type}</td>
                    <td className="px-6 py-4">{getPhaseBadge(account.phase)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(account.balance)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {account.profit >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={account.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(account.profit)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className={account.maxDrawdownUsed > 8 ? 'text-red-600' : 'text-gray-600'}>
                          Max: {account.maxDrawdownUsed.toFixed(1)}%
                        </span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className={account.dailyDrawdownUsed > 4 ? 'text-amber-600' : 'text-gray-600'}>
                          Daily: {account.dailyDrawdownUsed.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openPhaseModal(account)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Change Phase
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPhaseModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Account Phase</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedAccount.accountNumber}</p>
              <p className="text-sm text-gray-500">Current Phase: {PHASE_LABELS[selectedAccount.phase as keyof typeof PHASE_LABELS]}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Phase</label>
                <select
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {PHASE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={phaseReason}
                  onChange={(e) => setPhaseReason(e.target.value)}
                  placeholder="Enter reason for phase change..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPhaseModal(false)
                  setSelectedAccount(null)
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePhase}
                disabled={!newPhase || newPhase === selectedAccount.phase}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
