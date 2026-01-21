'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function AccountsPage() {
  const accounts = [
    {
      id: 'acc_001',
      accountNumber: 'PTP-2024-001234',
      type: 'standard',
      phase: 'challenge_1',
      balance: 25250,
      profit: 250,
      status: 'active',
    },
    {
      id: 'acc_002',
      accountNumber: 'PTP-2024-001235',
      type: 'express',
      phase: 'challenge_2',
      balance: 52000,
      profit: 2000,
      status: 'active',
    },
  ]

  const getPhaseBadge = (phase: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      challenge_1: { bg: 'bg-blue-100', text: 'text-blue-700' },
      challenge_2: { bg: 'bg-purple-100', text: 'text-purple-700' },
      funded: { bg: 'bg-green-100', text: 'text-green-700' },
      breached: { bg: 'bg-red-100', text: 'text-red-700' },
    }
    const style = styles[phase] || styles.challenge_1
    const labels: Record<string, string> = {
      challenge_1: 'Challenge 1',
      challenge_2: 'Challenge 2',
      funded: 'Funded',
      breached: 'Breached',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {labels[phase] || phase}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4 mr-2" />
          New Challenge
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Account</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phase</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">P&L</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link href="/dashboard" className="font-medium text-primary-600 hover:text-primary-700">
                    {account.accountNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{account.type}</td>
                <td className="px-6 py-4">{getPhaseBadge(account.phase)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${account.balance.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={account.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {account.profit >= 0 ? '+' : ''}${account.profit.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                    {account.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href="/dashboard" className="text-sm text-primary-600 hover:text-primary-700">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
