'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, disabled, size = 'md', label, className }, ref) => {
    const sizes = {
      sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
      md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
      lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          checked ? 'bg-primary-600' : 'bg-gray-200',
          sizes[size].track,
          className
        )}
        aria-label={label}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg',
            'transform transition-transform duration-200 ease-in-out',
            checked ? sizes[size].translate : 'translate-x-0',
            sizes[size].thumb
          )}
        />
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'
