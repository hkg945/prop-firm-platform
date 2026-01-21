'use client'

import { Account, PHASE_INFO } from '@/types/dashboard'
import { formatCurrency, formatPercentage } from '@/services/dashboard'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react'

interface AccountStatusCardProps {
  account: Account
}

const phaseColors = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function AccountStatusCard({ account }: AccountStatusCardProps) {
  const phaseInfo = PHASE_INFO[account.phase]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{account.accountNumber}</h2>
            <p className="text-sm text-gray-500">
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
            </p>
          </div>
        </div>
        <div className={cn('px-4 py-2 rounded-lg border font-medium text-sm', phaseColors[phaseInfo.color])}>
          {phaseInfo.label}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Balance</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Equity</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.equity)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Net P&L</p>
          <div className="flex items-center">
            {account.profit >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500 mr-1" />
            )}
            <p
              className={cn(
                'text-2xl font-bold',
                account.profit >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatCurrency(account.profit)}
            </p>
          </div>
          <p
            className={cn(
              'text-sm font-medium',
              account.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {formatPercentage(account.profitPercentage)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Profit Target</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(account.profitTarget)}
          </p>
          <p className="text-sm text-gray-500">
            {((account.profit / account.profitTarget) * 100).toFixed(1)}% achieved
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Created: {new Date(account.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
