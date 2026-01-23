import { Symbol, Quote, Position, Order, Account } from '@/types/trading'

export const FOREX_PAIRS: Symbol[] = [
  { id: '1', symbol: 'EURUSD', name: 'Euro/US Dollar', type: 'forex', pipSize: 0.0001, lotSize: 100000, minLot: 0.01, maxLot: 100, tickSize: 0.00001, swapLong: -6.5, swapShort: 2.1, tradingHours: '24/5', isAvailable: true },
  { id: '2', symbol: 'GBPUSD', name: 'British Pound/US Dollar', type: 'forex', pipSize: 0.0001, lotSize: 100000, minLot: 0.01, maxLot: 100, tickSize: 0.00001, swapLong: -5.2, swapShort: 1.5, tradingHours: '24/5', isAvailable: true },
  { id: '3', symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', type: 'forex', pipSize: 0.01, lotSize: 100000, minLot: 0.01, maxLot: 100, tickSize: 0.001, swapLong: -8.5, swapShort: 3.2, tradingHours: '24/5', isAvailable: true },
  { id: '4', symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', type: 'forex', pipSize: 0.0001, lotSize: 100000, minLot: 0.01, maxLot: 100, tickSize: 0.00001, swapLong: -3.2, swapShort: 0.5, tradingHours: '24/5', isAvailable: true },
  { id: '5', symbol: 'USDCAD', name: 'US Dollar/Canadian Dollar', type: 'forex', pipSize: 0.0001, lotSize: 100000, minLot: 0.01, maxLot: 100, tickSize: 0.00001, swapLong: -5.8, swapShort: 2.2, tradingHours: '24/5', isAvailable: true },
  { id: '6', symbol: 'USDCHF', name: 'US Dollar/Swiss Franc', type: 'forex', pipSize: 0.0001, lotSize: 100000, minLot: 0.01, maxLot: 100, tickSize: 0.00001, swapLong: -8.2, swapShort: 4.5, tradingHours: '24/5', isAvailable: true },
  { id: '7', symbol: 'NZDUSD', name: 'New Zealand Dollar/US Dollar', type: 'forex', pipSize: 0.0001, lotSize: 100000, minLot: 0.01, maxLot: 100, tickSize: 0.00001, swapLong: -2.8, swapShort: 0.2, tradingHours: '24/5', isAvailable: true },
  { id: '8', symbol: 'EURGBP', name: 'Euro/British Pound', type: 'forex', pipSize: 0.0001, lotSize: 100000, minLot: 0.01, maxLot: 50, tickSize: 0.00001, swapLong: -3.5, swapShort: 1.8, tradingHours: '24/5', isAvailable: true },
]

export const CRYPTO_PAIRS: Symbol[] = [
  { id: '101', symbol: 'BTCUSD', name: 'Bitcoin/US Dollar', type: 'crypto', pipSize: 1, lotSize: 1, minLot: 0.01, maxLot: 10, tickSize: 0.01, swapLong: -0.05, swapShort: -0.05, tradingHours: '24/7', isAvailable: true },
  { id: '102', symbol: 'ETHUSD', name: 'Ethereum/US Dollar', type: 'crypto', pipSize: 0.01, lotSize: 1, minLot: 0.1, maxLot: 50, tickSize: 0.001, swapLong: -0.05, swapShort: -0.05, tradingHours: '24/7', isAvailable: true },
  { id: '103', symbol: 'XRPUSD', name: 'Ripple/US Dollar', type: 'crypto', pipSize: 0.0001, lotSize: 1, minLot: 1, maxLot: 5000, tickSize: 0.00001, swapLong: -0.05, swapShort: -0.05, tradingHours: '24/7', isAvailable: true },
]

export const INDICES: Symbol[] = [
  { id: '201', symbol: 'SPX500', name: 'S&P 500', type: 'indices', pipSize: 0.1, lotSize: 50, minLot: 0.1, maxLot: 20, tickSize: 0.01, swapLong: -15.5, swapShort: -8.2, tradingHours: '23:00-22:00', isAvailable: true },
  { id: '202', symbol: 'NAS100', name: 'NASDAQ 100', type: 'indices', pipSize: 0.1, lotSize: 20, minLot: 0.1, maxLot: 20, tickSize: 0.01, swapLong: -12.5, swapShort: -6.8, tradingHours: '23:00-22:00', isAvailable: true },
  { id: '203', symbol: 'UK100', name: 'FTSE 100', type: 'indices', pipSize: 0.1, lotSize: 10, minLot: 0.1, maxLot: 15, tickSize: 0.01, swapLong: -8.5, swapShort: -4.2, tradingHours: '01:00-23:00', isAvailable: true },
  { id: '204', symbol: 'DE40', name: 'DAX 40', type: 'indices', pipSize: 0.1, lotSize: 25, minLot: 0.1, maxLot: 15, tickSize: 0.01, swapLong: -18.5, swapShort: -9.8, tradingHours: '01:00-23:00', isAvailable: true },
]

export const COMMODITIES: Symbol[] = [
  { id: '301', symbol: 'XAUUSD', name: 'Gold', type: 'commodities', pipSize: 0.01, lotSize: 100, minLot: 0.01, maxLot: 50, tickSize: 0.001, swapLong: -12.5, swapShort: -8.2, tradingHours: '23:00-22:00', isAvailable: true },
  { id: '302', symbol: 'XAGUSD', name: 'Silver', type: 'commodities', pipSize: 0.001, lotSize: 5000, minLot: 0.1, maxLot: 100, tickSize: 0.0001, swapLong: -8.5, swapShort: -5.2, tradingHours: '23:00-22:00', isAvailable: true },
  { id: '303', symbol: 'CLUSD', name: 'Crude Oil', type: 'commodities', pipSize: 0.01, lotSize: 1000, minLot: 0.1, maxLot: 20, tickSize: 0.001, swapLong: -5.2, swapShort: -2.8, tradingHours: '23:00-22:00', isAvailable: true },
]

export function generateMockQuote(symbol: string): Quote {
  // Approximate 2026/Real Market Prices for better sync with TV Widget
  const basePrice = {
    'EURUSD': 1.0850, 
    'GBPUSD': 1.2750,
    'USDJPY': 151.50,
    'AUDUSD': 0.6550,
    'USDCAD': 1.3550,
    'USDCHF': 0.9050,
    'NZDUSD': 0.6050,
    'EURGBP': 0.8550,
    'BTCUSD': 92000, 
    'ETHUSD': 3500,
    'XRPUSD': 0.60,
    'SPX500': 5250,
    'NAS100': 18250,
    'UK100': 8000,
    'DE40': 18500,
    'XAUUSD': 2350.50,
    'XAGUSD': 28.50,
    'CLUSD': 82.50,
  }[symbol] || 1.0000

  const spread = {
    'forex': 0.0002,
    'crypto': basePrice * 0.0005, // Reduced spread
    'indices': basePrice * 0.001,
    'commodities': basePrice * 0.0005,
  }['forex']

  const change = (Math.random() - 0.5) * 0.02
  const changePercent = change * 100

  return {
    symbol,
    bid: basePrice - spread / 2,
    ask: basePrice + spread / 2,
    last: basePrice,
    prevClose: basePrice * (1 - changePercent / 100),
    change: basePrice * change,
    changePercent,
    high: basePrice * 1.005,
    low: basePrice * 0.995,
    volume: Math.floor(Math.random() * 1000000),
    time: new Date().toISOString(),
  }
}

export function generateMockPosition(symbol: string, side: 'long' | 'short'): Position {
  const basePrice = generateMockQuote(symbol).bid
  const volume = 0.5 + Math.random() * 1.5

  return {
    id: `pos_${Date.now()}`,
    accountId: 'demo_account',
    symbol,
    side,
    volume,
    openPrice: basePrice,
    currentPrice: basePrice * (1 + (Math.random() - 0.5) * 0.01),
    sl: basePrice * (side === 'long' ? 0.98 : 1.02),
    tp: basePrice * (side === 'long' ? 1.03 : 0.97),
    swap: 0,
    commission: volume * 3.5,
    profit: (Math.random() - 0.3) * 500,
    profitPercent: (Math.random() - 0.3) * 10,
    margin: volume * 1000,
    marginPercent: 1.5,
    openTime: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function generateMockAccount(): Account {
  return {
    id: 'demo_account',
    accountNumber: 'DEMO-001234',
    challengeType: 'Evaluation',
    phase: 'funded',
    balance: 100000,
    equity: 100500,
    usedMargin: 1500,
    freeMargin: 99000,
    marginPercent: 1.5,
    profit: 500,
    profitPercent: 0.5,
    totalVolume: 125.5,
    openPositions: 3,
    totalTrades: 47,
    winningTrades: 31,
    losingTrades: 16,
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  }
}

export function formatPipValue(value: number, symbol: string): string {
  const symbols = ['XAUUSD', 'XAGUSD']
  const decimals = symbols.includes(symbol) ? 2 : 5
  return value.toFixed(decimals)
}

export function formatVolume(lots: number): string {
  if (lots >= 1) {
    return lots.toFixed(2)
  }
  return lots.toFixed(3)
}

export function calculatePositionSize(
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number,
  pipValue: number
): number {
  const riskAmount = accountBalance * (riskPercent / 100)
  return riskAmount / (stopLossPips * pipValue)
}
