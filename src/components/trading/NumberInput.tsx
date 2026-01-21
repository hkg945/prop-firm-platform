'use client'

import { forwardRef, useCallback, useState, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  decimals?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'buy' | 'sell'
  label?: string
  prefix?: string
  suffix?: string
  className?: string
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({
    value,
    onChange,
    min = 0,
    max = Infinity,
    step = 0.01,
    decimals = 2,
    disabled,
    size = 'md',
    variant = 'default',
    label,
    prefix,
    suffix,
    className
  }, ref) => {
    const [displayValue, setDisplayValue] = useState(value.toFixed(decimals))

    useEffect(() => {
      setDisplayValue(value.toFixed(decimals))
    }, [value, decimals])

    const parseValue = useCallback((input: string) => {
      const cleaned = input.replace(/[^0-9.]/g, '')
      const parsed = parseFloat(cleaned)
      if (isNaN(parsed)) return value
      return Math.max(min, Math.min(max, parsed))
    }, [value, min, max])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      setDisplayValue(input)
      const parsed = parseFloat(input)
      if (!isNaN(parsed)) {
        onChange(Math.max(min, Math.min(max, parsed)))
      }
    }

    const handleBlur = () => {
      setDisplayValue(value.toFixed(decimals))
    }

    const increment = () => {
      const newValue = Math.min(max, value + step)
      onChange(Number(newValue.toFixed(decimals)))
    }

    const decrement = () => {
      const newValue = Math.max(min, value - step)
      onChange(Number(newValue.toFixed(decimals)))
    }

    const sizes = {
      sm: 'h-8 text-sm',
      md: 'h-10',
      lg: 'h-12 text-lg',
    }

    const variants = {
      default: 'border-gray-200 focus:border-primary-500',
      buy: 'border-green-200 bg-green-50 focus:border-green-500',
      sell: 'border-red-200 bg-red-50 focus:border-red-500',
    }

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className={cn(
          'flex items-center border rounded-lg overflow-hidden',
          'focus-within:ring-2 focus-within:ring-offset-0',
          variants[variant],
          disabled && 'opacity-50 cursor-not-allowed'
        )}>
          {prefix && (
            <span className="px-3 text-gray-500 bg-gray-50 border-r">
              {prefix}
            </span>
          )}
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || value <= min}
            className="px-2 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              'flex-1 text-center bg-transparent border-x',
              'focus:outline-none',
              'appearance-none',
              sizes[size]
            )}
          />
          <button
            type="button"
            onClick={increment}
            disabled={disabled || value >= max}
            className="px-2 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
          {suffix && (
            <span className="px-3 text-gray-500 bg-gray-50 border-l">
              {suffix}
            </span>
          )}
        </div>
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'
