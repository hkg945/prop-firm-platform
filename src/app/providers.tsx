'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { TradingProvider } from '@/contexts/TradingContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TradingProvider>
        {children}
      </TradingProvider>
    </AuthProvider>
  )
}
