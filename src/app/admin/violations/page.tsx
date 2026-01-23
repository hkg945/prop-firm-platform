'use client'

import { useEffect, useState } from 'react'
import { AccountViolation, PaginatedViolations } from '@/types/admin'
import { getViolations, resolveViolation } from '@/services/admin'
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Clock, Eye, AlertOctagon } from 'lucide-react'

export default function AdminViolationsPage() {
  const [violations, setViolations] = useState<AccountViolation[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    async function loadViolations() {
      setLoading(true)
      const result = await getViolations(page, 10)
      setViolations(result.data)
      setTotalPages(result.totalPages)
      setLoading(false)
    }
    loadViolations()
  }, [page])

  const handleResolve = async (violationId: string) => {
    try {
      await resolveViolation(violationId, 'admin@edgeflowcapital.com')
      const result = await getViolations(page, 10)
      setViolations(result.data)
    } catch (error) {
      console.error('Failed to resolve violation:', error)
    }
  }

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, { bg: string; text: string; icon: typeof AlertOctagon }> = {
      warning: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertTriangle },
      critical: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertOctagon },
    }
    const style = styles[severity] || styles.warning
    const Icon = style.icon
    return (
      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', style.bg, style.text)}>
        <Icon className="w-3 h-3 mr-1" />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
      reviewed: { bg: 'bg-blue-100', text: 'text-blue-700' },
      resolved: { bg: 'bg-green-100', text: 'text-green-700' },
    }
    const style = styles[status] || styles.pending
    return (
      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', style.bg, style.text)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      max_drawdown: 'Max Drawdown Exceeded',
      daily_drawdown: 'Daily Drawdown Warning',
      rule_violation: 'Rule Violation',
      suspicious_activity: 'Suspicious Activity',
    }
    return labels[type] || type
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

  const pendingCount = violations.filter(v => v.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Violations</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and resolve account violations</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700 font-medium">{pendingCount} Pending</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : violations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <p>No violations found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {violations.map((violation) => (
              <div key={violation.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getSeverityBadge(violation.severity)}
                      {getStatusBadge(violation.status)}
                      <span className="text-sm text-gray-500">{getTypeLabel(violation.type)}</span>
                    </div>
                    <p className="text-gray-900 mb-2">{violation.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Account: {violation.accountId}</span>
                      <span>User: {violation.userId}</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(violation.createdAt)}
                      </span>
                      {violation.reviewedBy && (
                        <span>Reviewed by: {violation.reviewedBy}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {violation.status === 'pending' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleResolve(violation.id)}
                          className="flex items-center px-3 py-1.5 text-sm text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </button>
                      </>
                    )}
                    {violation.status === 'resolved' && (
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolved {violation.reviewedAt && formatDate(violation.reviewedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
