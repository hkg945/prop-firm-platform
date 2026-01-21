'use client'

import { useState } from 'react'
import { DollarSign, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

interface Payout {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'rejected'
  createdAt: string
  processedAt?: string
  method: 'bank' | 'crypto' | 'paypal'
}

export default function PayoutsPage() {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [amount, setAmount] = useState('')

  const payouts: Payout[] = [
    { id: 'pay_001', amount: 1250, status: 'completed', createdAt: '2024-01-15T10:00:00Z', processedAt: '2024-01-17T14:00:00Z', method: 'bank' },
    { id: 'pay_002', amount: 850, status: 'completed', createdAt: '2024-01-08T09:30:00Z', processedAt: '2024-01-10T11:00:00Z', method: 'crypto' },
    { id: 'pay_003', amount: 2500, status: 'pending', createdAt: '2024-01-20T15:00:00Z', method: 'bank' },
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    }
    const style = styles[status] || styles.pending
    const StatusIcon = style.icon
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <button
          onClick={() => setShowRequestModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Request Payout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Available for Payout</p>
          <p className="text-3xl font-bold text-gray-900">$4,250.00</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-amber-600">$2,500.00</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Paid Out</p>
          <p className="text-3xl font-bold text-green-600">$8,750.00</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Payout History</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Processed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{payout.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">${payout.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{payout.method}</td>
                <td className="px-6 py-4">{getStatusBadge(payout.status)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(payout.createdAt)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {payout.processedAt ? formatDate(payout.processedAt) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Payout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Available: $4,250.00</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="bank">Bank Transfer (3-5 business days)</option>
                  <option value="crypto">Cryptocurrency (24 hours)</option>
                  <option value="paypal">PayPal (24-48 hours)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
