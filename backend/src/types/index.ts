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
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface Account {
  id: string
  userId: string
  accountNumber: string
  type: 'standard' | 'express' | 'scaling'
  phase: 'challenge_1' | 'challenge_2' | 'funded' | 'breached' | 'completed'
  status: 'active' | 'paused' | 'breached' | 'completed'
  startingBalance: number
  balance: number
  equity: number
  margin: number
  freeMargin: number
  profit: number
  profitTarget: number
  profitPercentage: number
  maxDrawdown: number
  dailyDrawdown: number
  currentDrawdown: number
  maxDrawdownUsed: number
  dailyDrawdownUsed: number
  challengeStartedAt: Date
  challengeEndedAt?: Date
  breachedAt?: Date
  fundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Trade {
  id: string
  accountId: string
  mt4Ticket?: string
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  entryPrice: number
  exitPrice?: number
  entryTime: Date
  exitTime?: Date
  pnl: number
  pnlPercentage: number
  swap: number
  commission: number
  durationMinutes?: number
  status: 'open' | 'closed'
  tpLevel?: number
  slLevel?: number
  comments?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChallengeRule {
  id: string
  type: 'standard' | 'express' | 'scaling'
  name: string
  description?: string
  accountSize: number
  price: number
  profitTarget: number
  maxDrawdown: number
  dailyDrawdown: number
  minTradingDays: number
  durationDays: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AccountViolation {
  id: string
  accountId: string
  userId: string
  type: 'max_drawdown' | 'daily_drawdown' | 'rule_violation' | 'suspicious_activity'
  severity: 'warning' | 'critical'
  description: string
  details?: Record<string, any>
  status: 'pending' | 'reviewed' | 'resolved'
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewNotes?: string
}

export interface Payout {
  id: string
  userId: string
  accountId: string
  amount: number
  method: 'bank' | 'crypto' | 'paypal'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  walletAddress?: string
  bankAccountLast4?: string
  transactionId?: string
  requestNotes?: string
  requestedAt: Date
  processedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface JwtPayload {
  userId: string
  email: string
  role: 'user' | 'admin'
  type: 'access' | 'refresh'
}

export interface AuthUser {
  id: string
  email: string
  role: 'user' | 'admin'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
