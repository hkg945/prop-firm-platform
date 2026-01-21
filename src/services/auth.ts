export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  country?: string
  timezone: string
  avatarUrl?: string
  status: 'active' | 'suspended' | 'banned'
  emailVerified: boolean
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    accessToken: string
    refreshToken: string
  }
  error?: string
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  country?: string
  timezone?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: data.error || 'Login failed',
    }
  }

  return {
    success: true,
    data: data.data,
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: result.error || 'Registration failed',
    }
  }

  return {
    success: true,
    data: result.data,
  }
}

export async function refreshToken(refreshToken: string): Promise<{ accessToken: string } | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await response.json()
    
    if (response.ok && data.data) {
      return data.data
    }
    return null
  } catch {
    return null
  }
}

export async function getProfile(accessToken: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    
    if (response.ok && data.data) {
      return data.data.user
    }
    return null
  } catch {
    return null
  }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken')
  }
  return null
}

export function removeTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
