export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit'
export type OrderSide = 'buy' | 'sell'
export type OrderStatus = 'pending' | 'filled' | 'partial' | 'cancelled' | 'rejected'
export type PositionStatus = 'open' | 'closed'
export type PositionSide = 'long' | 'short'

export interface Symbol {
  id: string
  symbol: string
  name: string
  type: 'forex' | 'crypto' | 'indices' | 'commodities' | 'stocks'
  pipSize: number
  lotSize: number
  minLot: number
  maxLot: number
  tickSize: number
  swapLong: number
  swapShort: number
  tradingHours: string
  isAvailable: boolean
}

export interface Quote {
  symbol: string
  bid: number
  ask: number
  last: number
  prevClose: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  time: string
}

export interface TickSize {
  size: number
  price: number
}

export interface Order {
  id: string
  accountId: string
  symbol: string
  side: OrderSide
  type: OrderType
  volume: number
  price?: number
  stopPrice?: number
  limitPrice?: number
  sl?: number
  tp?: number
  status: OrderStatus
  filledVolume: number
  remainingVolume: number
  commission: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
  comment?: string
}

export interface Position {
  id: string
  accountId: string
  symbol: string
  side: PositionSide
  volume: number
  openPrice: number
  currentPrice: number
  sl?: number
  tp?: number
  swap: number
  commission: number
  profit: number
  profitPercent: number
  margin: number
  marginPercent: number
  openTime: string
  updatedAt: string
}

export interface Account {
  id: string
  accountNumber: string
  challengeType: string
  phase: 'challenge' | 'funded'
  balance: number
  equity: number
  usedMargin: number
  freeMargin: number
  marginPercent: number
  profit: number
  profitPercent: number
  totalVolume: number
  openPositions: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  status: 'active' | 'breached' | 'paused'
  createdAt: string
}

export interface Trade {
  id: string
  accountId: string
  orderId: string
  symbol: string
  side: OrderSide
  type: 'market' | 'limit' | 'stop'
  volume: number
  openPrice: number
  closePrice?: number
  sl?: number
  tp?: number
  commission: number
  swap: number
  profit?: number
  duration?: number
  openedAt: string
  closedAt?: string
}

export interface RiskCalculation {
  marginRequired: number
  pipValue: number
  suggestedSL: number
  suggestedTP: number
  maxVolume: number
  riskAmount: number
  riskPercent: number
}

export interface OrderFormData {
  symbol: string
  side: OrderSide
  type: OrderType
  volume: number
  price?: number
  stopPrice?: number
  sl?: number
  tp?: number
  comment?: string
  expiration?: string
}

export interface ChartConfig {
  symbol: string
  interval: ChartInterval
  theme: 'light' | 'dark'
  timezone: string
}

export type ChartInterval = '1' | '3' | '5' | '15' | '30' | '60' | '120' | '240' | 'D' | 'W' | 'M'

export interface WatchlistItem {
  symbol: string
  bid: number
  ask: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
}

export interface DepthData {
  bids: { price: number; volume: number }[]
  asks: { price: number; volume: number }[]
}

export interface RecentTrade {
  id: string
  price: number
  volume: number
  time: string
  side: OrderSide
}
