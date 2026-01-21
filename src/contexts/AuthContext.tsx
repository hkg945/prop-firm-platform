'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, login as loginApi, register as registerApi, getProfile, setTokens, removeTokens, getAccessToken, getRefreshToken } from '@/services/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string; country?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initAuth() {
      const token = getAccessToken()
      if (token) {
        const userData = await getProfile(token)
        if (userData) {
          setUser(userData)
        } else {
          removeTokens()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = await loginApi({ email, password })
    
    if (result.success && result.data) {
      setTokens(result.data.accessToken, result.data.refreshToken)
      setUser(result.data.user)
      return { success: true }
    }
    
    return { success: false, error: result.error }
  }

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string; country?: string }): Promise<{ success: boolean; error?: string }> => {
    const result = await registerApi(data)
    
    if (result.success && result.data) {
      setTokens(result.data.accessToken, result.data.refreshToken)
      setUser(result.data.user)
      return { success: true }
    }
    
    return { success: false, error: result.error }
  }

  const logout = () => {
    removeTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
