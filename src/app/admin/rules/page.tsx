'use client'

import { useEffect, useState } from 'react'
import { ChallengeRule } from '@/types/admin'
import { getRules, updateRule } from '@/services/admin'
import { Save, CheckCircle, XCircle } from 'lucide-react'

export default function AdminRulesPage() {
  const [rules, setRules] = useState<ChallengeRule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, Partial<ChallengeRule>>>({})

  useEffect(() => {
    async function loadRules() {
      const data = await getRules()
      setRules(data)
      setLoading(false)
    }
    loadRules()
  }, [])

  const handleChange = (ruleId: string, field: string, value: number | boolean) => {
    setEditData(prev => ({
      ...prev,
      [ruleId]: {
        ...(prev[ruleId] || {}),
        [field]: value,
      },
    }))
  }

  const handleSave = async (ruleId: string) => {
    const changes = editData[ruleId]
    if (!changes) return

    setSaving(ruleId)
    try {
      const updated = await updateRule(ruleId, changes)
      setRules(prev => prev.map(r => r.id === ruleId ? updated : r))
      setEditData(prev => {
        const next = { ...prev }
        delete next[ruleId]
        return next
      })
    } catch (error) {
      console.error('Failed to update rule:', error)
    } finally {
      setSaving(null)
    }
  }

  const getRuleName = (type: string) => {
    const names: Record<string, string> = {
      standard: 'Standard Challenge',
      express: 'Express Challenge',
      scaling: 'Scaling Challenge',
    }
    return names[type] || type
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading rules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Challenge Rules</h1>
        <p className="text-sm text-gray-500 mt-1">Configure challenge parameters for each account type</p>
      </div>

      <div className="space-y-6">
        {rules.map((rule) => {
          const isEditing = !!editData[rule.id]
          const saveLoading = saving === rule.id

          return (
            <div key={rule.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{getRuleName(rule.type)}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {rule.isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" /> Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData[rule.id]?.isActive ?? rule.isActive}
                      onChange={(e) => {
                        handleChange(rule.id, 'isActive', e.target.checked)
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    <span className="ml-2 text-sm text-gray-600">Active</span>
                  </label>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Size</label>
                    <input
                      type="text"
                      value={formatCurrency(editData[rule.id]?.accountSize ?? rule.accountSize)}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="text"
                      value={formatCurrency(editData[rule.id]?.price ?? rule.price)}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profit Target %
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={editData[rule.id]?.profitTarget ?? rule.profitTarget}
                      onChange={(e) => handleChange(rule.id, 'profitTarget', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Drawdown %
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={editData[rule.id]?.maxDrawdown ?? rule.maxDrawdown}
                      onChange={(e) => handleChange(rule.id, 'maxDrawdown', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Drawdown %
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={editData[rule.id]?.dailyDrawdown ?? rule.dailyDrawdown}
                      onChange={(e) => handleChange(rule.id, 'dailyDrawdown', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={editData[rule.id]?.duration ?? rule.duration}
                      onChange={(e) => handleChange(rule.id, 'duration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Trading Days
                    </label>
                    <input
                      type="number"
                      value={editData[rule.id]?.minTradingDays ?? rule.minTradingDays}
                      onChange={(e) => handleChange(rule.id, 'minTradingDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSave(rule.id)}
                    disabled={!isEditing || saveLoading}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
