import {
  User,
  AdminAccount,
  ChallengeRule,
  AccountViolation,
  AdminStats,
  PaginatedUsers,
  PaginatedAccounts,
  PaginatedViolations,
  PHASE_LABELS,
} from '@/types/admin'

const MOCK_DELAY = 500

const mockUsers: User[] = [
  {
    id: 'usr_001',
    email: 'john.trader@email.com',
    firstName: 'John',
    lastName: 'Trader',
    phone: '+1 234 567 8900',
    country: 'United States',
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    accounts: [],
  },
  {
    id: 'usr_002',
    email: 'sarah.trade@email.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+44 20 7123 4567',
    country: 'United Kingdom',
    status: 'active',
    createdAt: '2024-01-08T14:30:00Z',
    accounts: [],
  },
  {
    id: 'usr_003',
    email: 'mike.trades@email.com',
    firstName: 'Mike',
    lastName: 'Chen',
    phone: '+852 9876 5432',
    country: 'Hong Kong',
    status: 'active',
    createdAt: '2024-01-05T09:15:00Z',
    accounts: [],
  },
  {
    id: 'usr_004',
    email: 'emma.fx@email.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    phone: '+61 2 1234 5678',
    country: 'Australia',
    status: 'suspended',
    createdAt: '2024-01-03T16:45:00Z',
    accounts: [],
  },
  {
    id: 'usr_005',
    email: 'alex.trading@email.com',
    firstName: 'Alex',
    lastName: 'Martinez',
    phone: '+34 91 123 4567',
    country: 'Spain',
    status: 'active',
    createdAt: '2024-01-01T11:20:00Z',
    accounts: [],
  },
]

const mockAccounts: AdminAccount[] = [
  {
    id: 'acc_001',
    userId: 'usr_001',
    accountNumber: `EF-${Math.floor(Math.random() * 1000000)}`,
    type: 'standard',
    phase: 'challenge_1',
    status: 'active',
    balance: 25250,
    equity: 25250,
    startingBalance: 25000,
    profit: 250,
    profitTarget: 2000,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    currentDrawdown: 1.0,
    dailyDrawdownUsed: 1.0,
    maxDrawdownUsed: 1.0,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc_002',
    userId: 'usr_002',
    accountNumber: `EF-${Math.floor(Math.random() * 1000000)}`,
    type: 'standard',
    phase: 'challenge_2',
    status: 'active',
    balance: 28000,
    equity: 28000,
    startingBalance: 25000,
    profit: 3000,
    profitTarget: 2500,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    currentDrawdown: 2.5,
    dailyDrawdownUsed: 2.0,
    maxDrawdownUsed: 2.5,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc_003',
    userId: 'usr_003',
    accountNumber: `EF-${Math.floor(Math.random() * 1000000)}`,
    type: 'express',
    phase: 'funded',
    status: 'active',
    balance: 52500,
    equity: 52500,
    startingBalance: 50000,
    profit: 2500,
    profitTarget: 5000,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    currentDrawdown: 5.0,
    dailyDrawdownUsed: 4.5,
    maxDrawdownUsed: 5.0,
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc_004',
    userId: 'usr_004',
    accountNumber: `EF-${Math.floor(Math.random() * 1000000)}`,
    type: 'standard',
    phase: 'breached',
    status: 'breached',
    balance: 23000,
    equity: 23000,
    startingBalance: 25000,
    profit: -2000,
    profitTarget: 2000,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    currentDrawdown: 8.0,
    dailyDrawdownUsed: 5.0,
    maxDrawdownUsed: 8.0,
    breachedAt: '2024-01-18T15:30:00Z',
    createdAt: '2024-01-05T16:00:00Z',
    updatedAt: '2024-01-18T15:30:00Z',
  },
  {
    id: 'acc_005',
    userId: 'usr_005',
    accountNumber: `EF-${Math.floor(Math.random() * 1000000)}`,
    type: 'scaling',
    phase: 'challenge_1',
    status: 'active',
    balance: 101000,
    equity: 101000,
    startingBalance: 100000,
    profit: 1000,
    profitTarget: 10000,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    currentDrawdown: 1.0,
    dailyDrawdownUsed: 1.0,
    maxDrawdownUsed: 1.0,
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: new Date().toISOString(),
  },
]

const mockRules: ChallengeRule[] = [
  {
    id: 'rule_001',
    type: 'standard',
    name: 'Standard Challenge',
    profitTarget: 8,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    minTradingDays: 5,
    duration: 30,
    price: 99,
    accountSize: 25000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule_002',
    type: 'express',
    name: 'Express Challenge',
    profitTarget: 8,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    minTradingDays: 3,
    duration: 14,
    price: 149,
    accountSize: 25000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule_003',
    type: 'scaling',
    name: 'Scaling Challenge',
    profitTarget: 10,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    minTradingDays: 10,
    duration: 60,
    price: 399,
    accountSize: 100000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockViolations: AccountViolation[] = [
  {
    id: 'vio_001',
    accountId: 'acc_004',
    userId: 'usr_004',
    type: 'max_drawdown',
    severity: 'critical',
    description: 'Account exceeded maximum drawdown limit of 10%. Current drawdown at 12%.',
    status: 'pending',
    createdAt: '2024-01-18T15:30:00Z',
  },
  {
    id: 'vio_002',
    accountId: 'acc_003',
    userId: 'usr_003',
    type: 'daily_drawdown',
    severity: 'warning',
    description: 'Daily drawdown limit approaching. Currently at 4.5% of 5% daily limit.',
    status: 'reviewed',
    createdAt: '2024-01-17T14:00:00Z',
    reviewedAt: '2024-01-17T15:00:00Z',
    reviewedBy: 'admin@edgeflowcapital.com',
  },
  {
    id: 'vio_003',
    accountId: 'acc_001',
    userId: 'usr_001',
    type: 'suspicious_activity',
    severity: 'critical',
    description: 'Unusual trading pattern detected. High-frequency trades with low profit margins.',
    status: 'pending',
    createdAt: '2024-01-16T10:30:00Z',
  },
]

export async function getAdminStats(): Promise<AdminStats> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  return {
    totalUsers: mockUsers.length,
    activeAccounts: mockAccounts.filter((a) => a.status === 'active').length,
    totalFunded: mockAccounts.filter((a) => a.phase === 'funded').length,
    pendingViolations: mockViolations.filter((v) => v.status === 'pending').length,
    monthlyPayouts: 8750,
    newUsersThisMonth: 12,
  }
}

export async function getUsers(page = 1, pageSize = 10): Promise<PaginatedUsers> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockUsers.slice(start, end)
  return {
    data,
    total: mockUsers.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockUsers.length / pageSize),
  }
}

export async function getAccounts(page = 1, pageSize = 10): Promise<PaginatedAccounts> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockAccounts.slice(start, end)
  return {
    data,
    total: mockAccounts.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockAccounts.length / pageSize),
  }
}

export async function getViolations(page = 1, pageSize = 10): Promise<PaginatedViolations> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockViolations.slice(start, end)
  return {
    data,
    total: mockViolations.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockViolations.length / pageSize),
  }
}

export async function getRules(): Promise<ChallengeRule[]> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  return [...mockRules]
}

export async function updateRule(ruleId: string, updates: Partial<ChallengeRule>): Promise<ChallengeRule> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  const ruleIndex = mockRules.findIndex((r) => r.id === ruleId)
  if (ruleIndex === -1) throw new Error('Rule not found')
  mockRules[ruleIndex] = { ...mockRules[ruleIndex], ...updates, updatedAt: new Date().toISOString() }
  return mockRules[ruleIndex]
}

export async function changeAccountPhase(
  accountId: string,
  newPhase: string,
  reason: string
): Promise<AdminAccount> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  const accountIndex = mockAccounts.findIndex((a) => a.id === accountId)
  if (accountIndex === -1) throw new Error('Account not found')
  mockAccounts[accountIndex] = {
    ...mockAccounts[accountIndex],
    phase: newPhase as any,
    updatedAt: new Date().toISOString(),
  }
  return mockAccounts[accountIndex]
}

export async function updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned'): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex === -1) throw new Error('User not found')
  mockUsers[userIndex] = { ...mockUsers[userIndex], status }
  return mockUsers[userIndex]
}

export async function resolveViolation(violationId: string, reviewedBy: string): Promise<AccountViolation> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  const violationIndex = mockViolations.findIndex((v) => v.id === violationId)
  if (violationIndex === -1) throw new Error('Violation not found')
  mockViolations[violationIndex] = {
    ...mockViolations[violationIndex],
    status: 'resolved',
    reviewedAt: new Date().toISOString(),
    reviewedBy,
  }
  return mockViolations[violationIndex]
}
