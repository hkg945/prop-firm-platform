'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underlined'
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, variant = 'default', className }: TabsProps) {
  const baseStyles = 'flex items-center gap-1 p-1'

  const variantStyles = {
    default: 'bg-gray-100 rounded-lg',
    pills: '',
    underlined: 'border-b border-gray-200 gap-0 p-0',
  }

  const tabBaseStyles = {
    default: 'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
    pills: 'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
    underlined: 'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
  }

  const tabVariantStyles = {
    default: {
      active: 'bg-white text-gray-900 shadow-sm',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
    pills: {
      active: 'bg-primary-100 text-primary-700',
      inactive: 'text-gray-600 hover:bg-gray-100',
    },
    underlined: {
      active: 'border-primary-600 text-primary-600',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700',
    },
  }

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2',
            tabBaseStyles[variant],
            tab.id === activeTab
              ? tabVariantStyles[variant].active
              : tabVariantStyles[variant].inactive
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={cn(
              'px-1.5 py-0.5 text-xs rounded-full',
              tab.id === activeTab ? 'bg-primary-200 text-primary-800' : 'bg-gray-200 text-gray-600'
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
