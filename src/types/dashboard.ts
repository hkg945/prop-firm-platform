export type AccountPhase = 'challenge_1' | 'challenge_2' | 'funded' | 'breached' | 'completed'

export type AccountStatus = 'active' | 'paused' | 'breached' | 'completed'

export interface Account {
  id: string
  userId: string
  accountNumber: string
  type: 'standard' | 'express' | 'scaling'
  phase: AccountPhase
  status: AccountStatus
  balance: number
  equity: number
  startingBalance: number
  profitTarget: number
  maxDrawdown: number
  dailyDrawdown: number
  currentDrawdown: number
  dailyDrawdownRemaining: number
  maxDrawdownRemaining: number
  profit: number
  profitPercentage: number
  createdAt: string
  updatedAt: string
  challengeId?: string
}

export interface Trade {
  id: string
  accountId: string
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  entryPrice: number
  exitPrice: number
  entryTime: string
  exitTime: string
  pnl: number
  pnlPercentage: number
  swap: number
  commission: number
  duration: number
  status: 'closed' | 'open'
  tp?: number
  sl?: number
}

export interface AccountStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  longestWinningStreak: number
  longestLosingStreak: number
  averageTradeDuration: number
}

export interface DashboardData {
  account: Account
  stats: AccountStats
  recentTrades: Trade[]
  dailyPnL: Array<{ date: string; pnl: number }>
}

export interface PaginatedTrades {
  data: Trade[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DrawdownData {
  daily: {
    used: number
    remaining: number
    percentage: number
  }
  max: {
    used: number
    remaining: number
    percentage: number
  }
}

export interface PhaseInfo {
  phase: AccountPhase
  label: string
  color: 'blue' | 'green' | 'purple' | 'red' | 'amber'
  description: string
}

export const PHASE_INFO: Record<AccountPhase, PhaseInfo> = {
  challenge_1: {
    phase: 'challenge_1',
    label: 'Challenge Phase 1',
    color: 'blue',
    description: 'First evaluation phase',
  },
  challenge_2: {
    phase: 'challenge_2',
    label: 'Challenge Phase 2',
    color: 'purple',
    description: 'Verification phase',
  },
  funded: {
    phase: 'funded',
    label: 'Funded Account',
    color: 'green',
    description: 'Live trading account',
  },
  breached: {
    phase: 'breached',
    label: 'Breached',
    color: 'red',
    description: 'Account breached',
  },
  completed: {
    phase: 'completed',
    label: 'Completed',
    color: 'amber',
    description: 'Challenge completed',
  },
}
