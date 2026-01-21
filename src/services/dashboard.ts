import { Account, Trade, AccountStats, DashboardData, PaginatedTrades } from '@/types/dashboard'

const MOCK_DELAY = 500

const mockAccount: Account = {
  id: 'acc_001',
  userId: 'usr_001',
  accountNumber: 'PTP-2024-001234',
  type: 'standard',
  phase: 'challenge_1',
  status: 'active',
  balance: 25250,
  equity: 25250,
  startingBalance: 25000,
  profitTarget: 2000,
  maxDrawdown: 10,
  dailyDrawdown: 5,
  currentDrawdown: 0,
  dailyDrawdownRemaining: 1250,
  maxDrawdownRemaining: 2250,
  profit: 250,
  profitPercentage: 1.0,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: new Date().toISOString(),
  challengeId: 'chl_001',
}

const mockTrades: Trade[] = [
  {
    id: 'trd_001',
    accountId: 'acc_001',
    symbol: 'EURUSD',
    direction: 'buy',
    volume: 1.0,
    entryPrice: 1.0850,
    exitPrice: 1.0925,
    entryTime: '2024-01-20T08:30:00Z',
    exitTime: '2024-01-20T14:45:00Z',
    pnl: 750,
    pnlPercentage: 3.0,
    swap: 0,
    commission: -7,
    duration: 375,
    status: 'closed',
  },
  {
    id: 'trd_002',
    accountId: 'acc_001',
    symbol: 'GBPUSD',
    direction: 'sell',
    volume: 0.5,
    entryPrice: 1.2710,
    exitPrice: 1.2650,
    entryTime: '2024-01-19T14:00:00Z',
    exitTime: '2024-01-19T16:30:00Z',
    pnl: 300,
    pnlPercentage: 2.4,
    swap: 0,
    commission: -3.5,
    duration: 150,
    status: 'closed',
  },
  {
    id: 'trd_003',
    accountId: 'acc_001',
    symbol: 'USDCAD',
    direction: 'buy',
    volume: 1.0,
    entryPrice: 1.3420,
    exitPrice: 1.3380,
    entryTime: '2024-01-19T10:15:00Z',
    exitTime: '2024-01-19T12:00:00Z',
    pnl: -298,
    pnlPercentage: -2.2,
    swap: 0,
    commission: -7,
    duration: 105,
    status: 'closed',
  },
  {
    id: 'trd_004',
    accountId: 'acc_001',
    symbol: 'AUDUSD',
    direction: 'buy',
    volume: 0.75,
    entryPrice: 0.6520,
    exitPrice: 0.6585,
    entryTime: '2024-01-18T22:00:00Z',
    exitTime: '2024-01-19T06:30:00Z',
    pnl: 365.63,
    pnlPercentage: 7.5,
    swap: 0,
    commission: -5.25,
    duration: 510,
    status: 'closed',
  },
  {
    id: 'trd_005',
    accountId: 'acc_001',
    symbol: 'EURJPY',
    direction: 'sell',
    volume: 1.0,
    entryPrice: 162.50,
    exitPrice: 161.80,
    entryTime: '2024-01-18T08:00:00Z',
    exitTime: '2024-01-18T11:45:00Z',
    pnl: 437.5,
    pnlPercentage: 2.7,
    swap: 0,
    commission: -7,
    duration: 225,
    status: 'closed',
  },
  {
    id: 'trd_006',
    accountId: 'acc_001',
    symbol: 'NAS100',
    direction: 'buy',
    volume: 0.1,
    entryPrice: 17250,
    exitPrice: 17320,
    entryTime: '2024-01-18T09:30:00Z',
    exitTime: '2024-01-18T14:00:00Z',
    pnl: 700,
    pnlPercentage: 4.0,
    swap: 0,
    commission: -3,
    duration: 270,
    status: 'closed',
  },
  {
    id: 'trd_007',
    accountId: 'acc_001',
    symbol: 'XAUUSD',
    direction: 'sell',
    volume: 0.5,
    entryPrice: 2030.50,
    exitPrice: 2022.00,
    entryTime: '2024-01-17T16:00:00Z',
    exitTime: '2024-01-17T19:30:00Z',
    pnl: 425,
    pnlPercentage: 4.2,
    swap: 0,
    commission: -5,
    duration: 210,
    status: 'closed',
  },
  {
    id: 'trd_008',
    accountId: 'acc_001',
    symbol: 'EURUSD',
    direction: 'sell',
    volume: 1.0,
    entryPrice: 1.0920,
    exitPrice: 1.0950,
    entryTime: '2024-01-17T10:00:00Z',
    exitTime: '2024-01-17T11:30:00Z',
    pnl: -300,
    pnlPercentage: -2.75,
    swap: 0,
    commission: -7,
    duration: 90,
    status: 'closed',
  },
]

const mockStats: AccountStats = {
  totalTrades: 47,
  winningTrades: 31,
  losingTrades: 16,
  winRate: 65.96,
  averageWin: 485.5,
  averageLoss: -285.3,
  profitFactor: 3.32,
  longestWinningStreak: 8,
  longestLosingStreak: 3,
  averageTradeDuration: 195,
}

const mockDailyPnL = [
  { date: '2024-01-15', pnl: 250 },
  { date: '2024-01-16', pnl: 185 },
  { date: '2024-01-17', pnl: -125 },
  { date: '2024-01-18', pnl: 962.5 },
  { date: '2024-01-19', pnl: 2 },
  { date: '2024-01-20', pnl: 750 },
  { date: '2024-01-21', pnl: 0 },
]

export async function getAccount(): Promise<Account> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  return { ...mockAccount }
}

export async function getAccountStats(): Promise<AccountStats> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  return { ...mockStats }
}

export async function getTrades(page = 1, pageSize = 10): Promise<PaginatedTrades> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockTrades.slice(start, end)
  
  return {
    data,
    total: mockTrades.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockTrades.length / pageSize),
  }
}

export async function getRecentTrades(limit = 5): Promise<Trade[]> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  return mockTrades.slice(0, limit)
}

export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  
  return {
    account: { ...mockAccount },
    stats: { ...mockStats },
    recentTrades: mockTrades.slice(0, 5),
    dailyPnL: mockDailyPnL,
  }
}

export async function getDrawdownData(): Promise<{
  daily: { used: number; remaining: number; percentage: number }
  max: { used: number; remaining: number; percentage: number }
}> {
  const account = await getAccount()
  const dailyUsed = account.dailyDrawdown - account.dailyDrawdownRemaining
  const maxUsed = account.maxDrawdown - account.maxDrawdownRemaining
  
  return {
    daily: {
      used: dailyUsed,
      remaining: account.dailyDrawdownRemaining,
      percentage: (dailyUsed / account.startingBalance) * 100,
    },
    max: {
      used: maxUsed,
      remaining: account.maxDrawdownRemaining,
      percentage: (maxUsed / account.startingBalance) * 100,
    },
  }
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)} ${formatTime(dateString)}`
}
