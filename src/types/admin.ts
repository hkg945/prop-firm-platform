export type UserRole = 'admin' | 'manager' | 'trader'

export type AccountPhase = 'challenge_1' | 'challenge_2' | 'funded' | 'breached' | 'completed'

export type AccountStatus = 'active' | 'paused' | 'breached' | 'completed'

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: string
  lastLoginAt?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  country?: string
  status: 'active' | 'suspended' | 'banned'
  createdAt: string
  accounts: AdminAccount[]
}

export interface AdminAccount {
  id: string
  userId: string
  accountNumber: string
  type: 'standard' | 'express' | 'scaling'
  phase: AccountPhase
  status: AccountStatus
  balance: number
  equity: number
  startingBalance: number
  profit: number
  profitTarget: number
  maxDrawdown: number
  dailyDrawdown: number
  currentDrawdown: number
  dailyDrawdownUsed: number
  maxDrawdownUsed: number
  breachedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ChallengeRule {
  id: string
  type: 'standard' | 'express' | 'scaling'
  name: string
  profitTarget: number
  maxDrawdown: number
  dailyDrawdown: number
  minTradingDays: number
  duration: number
  price: number
  accountSize: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AccountViolation {
  id: string
  accountId: string
  userId: string
  type: 'max_drawdown' | 'daily_drawdown' | 'rule_violation' | 'suspicious_activity'
  severity: 'warning' | 'critical'
  description: string
  status: 'pending' | 'reviewed' | 'resolved'
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export interface AdminStats {
  totalUsers: number
  activeAccounts: number
  totalFunded: number
  pendingViolations: number
  monthlyPayouts: number
  newUsersThisMonth: number
}

export interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginatedAccounts {
  data: AdminAccount[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginatedViolations {
  data: AccountViolation[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PhaseChangeRequest {
  accountId: string
  fromPhase: AccountPhase
  toPhase: AccountPhase
  reason: string
  performedBy: string
}

export const PHASE_LABELS: Record<AccountPhase, string> = {
  challenge_1: 'Challenge 1',
  challenge_2: 'Challenge 2',
  funded: 'Funded',
  breached: 'Breached',
  completed: 'Completed',
}

export const PHASE_OPTIONS: { value: AccountPhase; label: string }[] = [
  { value: 'challenge_1', label: 'Challenge 1' },
  { value: 'challenge_2', label: 'Challenge 2' },
  { value: 'funded', label: 'Funded' },
  { value: 'breached', label: 'Breached' },
  { value: 'completed', label: 'Completed' },
]
