'use client'

import { useEffect, useState } from 'react'
import { Users, CreditCard, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'
import { AdminStats } from '@/types/admin'
import { getAdminStats } from '@/services/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Accounts',
      value: stats?.activeAccounts || 0,
      icon: CreditCard,
      color: 'bg-green-500',
    },
    {
      title: 'Funded Accounts',
      value: stats?.totalFunded || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Violations',
      value: stats?.pendingViolations || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      title: 'Monthly Payouts',
      value: `$${(stats?.monthlyPayouts || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-amber-500',
    },
    {
      title: 'New Users (Month)',
      value: stats?.newUsersThisMonth || 0,
      icon: Users,
      color: 'bg-teal-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/users" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Users className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-700">Manage Users</span>
            </a>
            <a href="/admin/accounts" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-700">View Accounts</span>
            </a>
            <a href="/admin/rules" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <TrendingUp className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-700">Configure Rules</span>
            </a>
            <a href="/admin/violations" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <AlertTriangle className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-700">Review Violations</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Server Status</span>
              <span className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Database</span>
              <span className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">API Status</span>
              <span className="flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-900">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
