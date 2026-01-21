'use client'

import { forwardRef, useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, value, onChange, label, placeholder = 'Select...', disabled, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <div ref={containerRef} className={cn('w-full', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 bg-white border rounded-lg text-sm text-left',
              'flex items-center justify-between',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              'border-gray-200'
            )}
          >
            <span className={cn(!selectedOption && 'text-gray-400')}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange?.(option.value)
                    setIsOpen(false)
                  }}
                  disabled={option.disabled}
                  className={cn(
                    'w-full px-3 py-2 text-sm text-left',
                    'hover:bg-gray-50',
                    'flex items-center justify-between',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                    option.value === value && 'bg-primary-50 text-primary-700'
                  )}
                >
                  {option.label}
                  {option.value === value && <Check className="w-4 h-4 text-primary-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)

Select.displayName = 'Select'
