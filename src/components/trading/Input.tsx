'use client'

import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  prefix?: ReactNode
  suffix?: ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, suffix, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'border-gray-200 focus:border-primary-500 focus:ring-primary-500',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2 bg-white border rounded-lg text-sm',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              variantClasses[variant],
              prefix && 'pl-9',
              suffix && 'pr-9',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
