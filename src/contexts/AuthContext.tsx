'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, login as loginApi, register as registerApi, getProfile, setTokens, removeTokens, getAccessToken, getRefreshToken } from '@/services/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1'

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
      try {
        const token = getAccessToken()
        if (token) {
          const userData = await getProfile(token)
          if (userData) {
            setUser(userData)
          } else {
            const refreshToken = getRefreshToken()
            if (refreshToken) {
              const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              })
              const data = await response.json()
              if (data.success && data.data?.accessToken) {
                setTokens(data.data.accessToken, refreshToken)
                const newUserData = await getProfile(data.data.accessToken)
                if (newUserData) {
                  setUser(newUserData)
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth init error:', error)
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
