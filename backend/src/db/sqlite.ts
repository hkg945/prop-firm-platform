import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const dbPath = path.join(__dirname, '../../data.db')

const db = new Database(dbPath)

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      timezone TEXT DEFAULT 'UTC',
      avatar_url TEXT,
      status TEXT DEFAULT 'active',
      email_verified INTEGER DEFAULT 0,
      two_factor_enabled INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      account_number TEXT UNIQUE NOT NULL,
      challenge_type TEXT NOT NULL,
      phase TEXT DEFAULT 'challenge',
      balance REAL DEFAULT 100000,
      equity REAL DEFAULT 100000,
      used_margin REAL DEFAULT 0,
      free_margin REAL DEFAULT 100000,
      profit REAL DEFAULT 0,
      profit_percent REAL DEFAULT 0,
      total_volume REAL DEFAULT 0,
      total_trades INTEGER DEFAULT 0,
      winning_trades INTEGER DEFAULT 0,
      losing_trades INTEGER DEFAULT 0,
      max_drawdown REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS symbols (
      id TEXT PRIMARY KEY,
      symbol TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      pip_size REAL NOT NULL,
      lot_size REAL NOT NULL,
      min_lot REAL NOT NULL,
      max_lot REAL NOT NULL,
      tick_size REAL NOT NULL,
      swap_long REAL DEFAULT 0,
      swap_short REAL DEFAULT 0,
      trading_hours TEXT,
      is_available INTEGER DEFAULT 1
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      side TEXT NOT NULL,
      type TEXT NOT NULL,
      volume REAL NOT NULL,
      price REAL,
      stop_price REAL,
      limit_price REAL,
      sl REAL,
      tp REAL,
      status TEXT DEFAULT 'pending',
      filled_volume REAL DEFAULT 0,
      remaining_volume REAL DEFAULT 0,
      commission REAL DEFAULT 0,
      comment TEXT,
      time_in_force TEXT DEFAULT 'gtc',
      expires_at TEXT,
      parent_order_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (parent_order_id) REFERENCES orders(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS positions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      order_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      side TEXT NOT NULL,
      volume REAL NOT NULL,
      open_price REAL NOT NULL,
      current_price REAL,
      sl REAL,
      tp REAL,
      swap REAL DEFAULT 0,
      commission REAL DEFAULT 0,
      profit REAL DEFAULT 0,
      profit_percent REAL DEFAULT 0,
      margin REAL DEFAULT 0,
      margin_percent REAL DEFAULT 0,
      status TEXT DEFAULT 'open',
      opened_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      position_id TEXT,
      order_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      side TEXT NOT NULL,
      type TEXT NOT NULL,
      volume REAL NOT NULL,
      open_price REAL NOT NULL,
      close_price REAL,
      sl REAL,
      tp REAL,
      commission REAL DEFAULT 0,
      swap REAL DEFAULT 0,
      profit REAL,
      pips REAL,
      duration_seconds INTEGER,
      opened_at TEXT NOT NULL,
      closed_at TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (position_id) REFERENCES positions(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS oco_groups (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    )
  `)

  console.log('Database initialized successfully')
}

export function seedSymbols() {
  const symbols = [
    { id: '1', symbol: 'EURUSD', name: 'Euro/US Dollar', type: 'forex', pip_size: 0.0001, lot_size: 100000, min_lot: 0.01, max_lot: 100, tick_size: 0.00001, swap_long: -6.5, swap_short: 2.1, trading_hours: '24/5', is_available: 1 },
    { id: '2', symbol: 'GBPUSD', name: 'British Pound/US Dollar', type: 'forex', pip_size: 0.0001, lot_size: 100000, min_lot: 0.01, max_lot: 100, tick_size: 0.00001, swap_long: -5.2, swap_short: 1.5, trading_hours: '24/5', is_available: 1 },
    { id: '3', symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', type: 'forex', pip_size: 0.01, lot_size: 100000, min_lot: 0.01, max_lot: 100, tick_size: 0.001, swap_long: -8.5, swap_short: 3.2, trading_hours: '24/5', is_available: 1 },
    { id: '4', symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', type: 'forex', pip_size: 0.0001, lot_size: 100000, min_lot: 0.01, max_lot: 100, tick_size: 0.00001, swap_long: -3.2, swap_short: 0.5, trading_hours: '24/5', is_available: 1 },
    { id: '5', symbol: 'USDCAD', name: 'US Dollar/Canadian Dollar', type: 'forex', pip_size: 0.0001, lot_size: 100000, min_lot: 0.01, max_lot: 100, tick_size: 0.00001, swap_long: -5.8, swap_short: 2.2, trading_hours: '24/5', is_available: 1 },
    { id: '6', symbol: 'USDCHF', name: 'US Dollar/Swiss Franc', type: 'forex', pip_size: 0.0001, lot_size: 100000, min_lot: 0.01, max_lot: 100, tick_size: 0.00001, swap_long: -8.2, swap_short: 4.5, trading_hours: '24/5', is_available: 1 },
    { id: '7', symbol: 'NZDUSD', name: 'New Zealand Dollar/US Dollar', type: 'forex', pip_size: 0.0001, lot_size: 100000, min_lot: 0.01, max_lot: 100, tick_size: 0.00001, swap_long: -2.8, swap_short: 0.2, trading_hours: '24/5', is_available: 1 },
    { id: '8', symbol: 'EURGBP', name: 'Euro/British Pound', type: 'forex', pip_size: 0.0001, lot_size: 100000, min_lot: 0.01, max_lot: 50, tick_size: 0.00001, swap_long: -3.5, swap_short: 1.8, trading_hours: '24/5', is_available: 1 },
    { id: '101', symbol: 'BTCUSD', name: 'Bitcoin/US Dollar', type: 'crypto', pip_size: 1, lot_size: 1, min_lot: 0.01, max_lot: 10, tick_size: 0.01, swap_long: -0.05, swap_short: -0.05, trading_hours: '24/7', is_available: 1 },
    { id: '102', symbol: 'ETHUSD', name: 'Ethereum/US Dollar', type: 'crypto', pip_size: 0.01, lot_size: 1, min_lot: 0.1, max_lot: 50, tick_size: 0.001, swap_long: -0.05, swap_short: -0.05, trading_hours: '24/7', is_available: 1 },
    { id: '201', symbol: 'SPX500', name: 'S&P 500', type: 'indices', pip_size: 0.1, lot_size: 50, min_lot: 0.1, max_lot: 20, tick_size: 0.01, swap_long: -15.5, swap_short: -8.2, trading_hours: '23:00-22:00', is_available: 1 },
    { id: '202', symbol: 'XAUUSD', name: 'Gold', type: 'commodities', pip_size: 0.01, lot_size: 100, min_lot: 0.01, max_lot: 50, tick_size: 0.001, swap_long: -12.5, swap_short: -8.2, trading_hours: '23:00-22:00', is_available: 1 },
    { id: '203', symbol: 'XAGUSD', name: 'Silver', type: 'commodities', pip_size: 0.001, lot_size: 5000, min_lot: 0.1, max_lot: 100, tick_size: 0.0001, swap_long: -8.5, swap_short: -5.2, trading_hours: '23:00-22:00', is_available: 1 },
  ]

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO symbols (id, symbol, name, type, pip_size, lot_size, min_lot, max_lot, tick_size, swap_long, swap_short, trading_hours, is_available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  symbols.forEach((s) => {
    stmt.run(
      s.id, s.symbol, s.name, s.type, s.pip_size, s.lot_size,
      s.min_lot, s.max_lot, s.tick_size, s.swap_long, s.swap_short,
      s.trading_hours, s.is_available
    )
  })
}

export function getUserByEmail(email: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
  return stmt.get(email) as any | undefined
}

export function getUserById(id: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
  return stmt.get(id) as any | undefined
}

export function createUser(user: {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phone?: string
  country?: string
  timezone?: string
}) {
  const stmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, phone, country, timezone, status, email_verified, two_factor_enabled, created_at, updated_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, 0, ?, ?, NULL)
  `)

  const now = new Date().toISOString()
  stmt.run(
    user.id, user.email, user.passwordHash, user.firstName, user.lastName,
    user.phone || null, user.country || null, user.timezone || 'UTC', now, now
  )

  return getUserById(user.id)
}

export function updateLastLogin(userId: string) {
  const stmt = db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
  const now = new Date().toISOString()
  stmt.run(now, userId)
}

export function getAccountByUserId(userId: string) {
  const stmt = db.prepare('SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
  return stmt.get(userId) as any | undefined
}

export function getAccountById(accountId: string) {
  const stmt = db.prepare('SELECT * FROM accounts WHERE id = ?')
  return stmt.get(accountId) as any | undefined
}

export function createAccount(data: { id: string; userId: string; accountNumber: string; challengeType: string; balance?: number }) {
  const stmt = db.prepare(`
    INSERT INTO accounts (id, user_id, account_number, challenge_type, balance, equity, free_margin, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
  `)

  const now = new Date().toISOString()
  const balance = data.balance || 100000
  stmt.run(data.id, data.userId, data.accountNumber, data.challengeType, balance, balance, balance, now, now)

  return getAccountById(data.id)
}

export function getAllSymbols() {
  const stmt = db.prepare('SELECT * FROM symbols WHERE is_available = 1 ORDER BY type, symbol')
  return stmt.all() as any[]
}

export function getSymbolBySymbol(symbol: string) {
  const stmt = db.prepare('SELECT * FROM symbols WHERE symbol = ?')
  return stmt.get(symbol) as any | undefined
}

export function createOrder(order: {
  id: string
  accountId: string
  userId: string
  symbol: string
  side: string
  type: string
  volume: number
  price?: number
  stopPrice?: number
  limitPrice?: number
  sl?: number
  tp?: number
  comment?: string
  timeInForce?: string
  expiresAt?: string
  parentOrderId?: string
}) {
  const stmt = db.prepare(`
    INSERT INTO orders (id, account_id, user_id, symbol, side, type, volume, price, stop_price, limit_price, sl, tp, status, filled_volume, remaining_volume, comment, time_in_force, expires_at, parent_order_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?, ?, ?, ?, ?, ?)
  `)

  const now = new Date().toISOString()
  stmt.run(
    order.id, order.accountId, order.userId, order.symbol, order.side, order.type, order.volume,
    order.price || null, order.stopPrice || null, order.limitPrice || null,
    order.sl || null, order.tp || null, order.volume, order.comment || null,
    order.timeInForce || 'gtc', order.expiresAt || null, order.parentOrderId || null, now, now
  )

  return getOrderById(order.id)
}

export function getOrderById(orderId: string) {
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ?')
  return stmt.get(orderId) as any | undefined
}

export function getOrdersByAccount(accountId: string, status?: string) {
  if (status) {
    const stmt = db.prepare('SELECT * FROM orders WHERE account_id = ? AND status = ? ORDER BY created_at DESC')
    return stmt.all(accountId, status) as any[]
  }
  const stmt = db.prepare('SELECT * FROM orders WHERE account_id = ? ORDER BY created_at DESC')
  return stmt.all(accountId) as any[]
}

export function updateOrderStatus(orderId: string, status: string, filledVolume?: number) {
  const stmt = db.prepare(`
    UPDATE orders SET status = ?, updated_at = ?${filledVolume !== undefined ? ', filled_volume = ?, remaining_volume = volume - ?' : ''}
    WHERE id = ?
  `)
  const now = new Date().toISOString()
  if (filledVolume !== undefined) {
    stmt.run(status, now, filledVolume, filledVolume, orderId)
  } else {
    stmt.run(status, now, orderId)
  }
}

export function deleteOrder(orderId: string) {
  const stmt = db.prepare('DELETE FROM orders WHERE id = ?')
  stmt.run(orderId)
}

export function createPosition(position: {
  id: string
  accountId: string
  userId: string
  orderId: string
  symbol: string
  side: string
  volume: number
  openPrice: number
  sl?: number
  tp?: number
}) {
  const symbolInfo = getSymbolBySymbol(position.symbol)
  const margin = position.volume * 1000

  const stmt = db.prepare(`
    INSERT INTO positions (id, account_id, user_id, order_id, symbol, side, volume, open_price, current_price, sl, tp, margin, status, opened_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)
  `)

  const now = new Date().toISOString()
  stmt.run(
    position.id, position.accountId, position.userId, position.orderId,
    position.symbol, position.side, position.volume, position.openPrice,
    position.openPrice, position.sl || null, position.tp || null, margin, now, now
  )

  return getPositionById(position.id)
}

export function getPositionById(positionId: string) {
  const stmt = db.prepare('SELECT * FROM positions WHERE id = ?')
  return stmt.get(positionId) as any | undefined
}

export function getOpenPositions(accountId: string) {
  const stmt = db.prepare('SELECT * FROM positions WHERE account_id = ? AND status = "open" ORDER BY opened_at DESC')
  return stmt.all(accountId) as any[]
}

export function updatePosition(id: string, updates: { sl?: number; tp?: number; current_price?: number }) {
  const fields: string[] = []
  const values: any[] = []

  if (updates.sl !== undefined) {
    fields.push('sl = ?')
    values.push(updates.sl)
  }
  if (updates.tp !== undefined) {
    fields.push('tp = ?')
    values.push(updates.tp)
  }
  if (updates.current_price !== undefined) {
    fields.push('current_price = ?')
    values.push(updates.current_price)
  }

  if (fields.length === 0) return null

  fields.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  const stmt = db.prepare(`UPDATE positions SET ${fields.join(', ')} WHERE id = ?`)
  stmt.run(...values)

  return getPositionById(id)
}

export function closePosition(positionId: string, closePrice: number, profit: number) {
  const stmt = db.prepare(`
    UPDATE positions SET status = 'closed', current_price = ?, profit = ?, updated_at = ?
    WHERE id = ?
  `)
  const now = new Date().toISOString()
  stmt.run(closePrice, profit, now, positionId)

  return getPositionById(positionId)
}

export function updateAccountMetrics(accountId: string) {
  const account = getAccountById(accountId)
  if (!account) return

  const positions = getOpenPositions(accountId)
  const usedMargin = positions.reduce((sum: number, p: any) => sum + (p.margin || 0), 0)
  const equity = account.balance + positions.reduce((sum: number, p: any) => sum + (p.profit || 0), 0)
  const freeMargin = equity - usedMargin

  const stmt = db.prepare(`
    UPDATE accounts SET equity = ?, used_margin = ?, free_margin = ?, profit = ?, profit_percent = ?, updated_at = ?
    WHERE id = ?
  `)
  const profit = equity - account.balance
  const profitPercent = (profit / account.balance) * 100
  const now = new Date().toISOString()
  stmt.run(equity, usedMargin, freeMargin, profit, profitPercent, now, accountId)
}

export function createTrade(trade: {
  id: string
  accountId: string
  userId: string
  positionId?: string
  orderId: string
  symbol: string
  side: string
  type: string
  volume: number
  openPrice: number
  closePrice?: number
  sl?: number
  tp?: number
  commission?: number
  swap?: number
  profit?: number
  pips?: number
  durationSeconds?: number
  openedAt: string
  closedAt?: string
}) {
  const stmt = db.prepare(`
    INSERT INTO trades (id, account_id, user_id, position_id, order_id, symbol, side, type, volume, open_price, close_price, sl, tp, commission, swap, profit, pips, duration_seconds, opened_at, closed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    trade.id, trade.accountId, trade.userId, trade.positionId || null, trade.orderId,
    trade.symbol, trade.side, trade.type, trade.volume, trade.openPrice,
    trade.closePrice || null, trade.sl || null, trade.tp || null,
    trade.commission || 0, trade.swap || 0, trade.profit || null,
    trade.pips || null, trade.durationSeconds || null, trade.openedAt, trade.closedAt || null
  )

  return getTradeById(trade.id)
}

export function getTradeById(tradeId: string) {
  const stmt = db.prepare('SELECT * FROM trades WHERE id = ?')
  return stmt.get(tradeId) as any | undefined
}

export function getTrades(accountId: string, options?: { limit?: number; offset?: number; symbol?: string }) {
  let query = 'SELECT * FROM trades WHERE account_id = ?'
  const params: any[] = [accountId]

  if (options?.symbol) {
    query += ' AND symbol = ?'
    params.push(options.symbol)
  }

  query += ' ORDER BY closed_at DESC, opened_at DESC'

  if (options?.limit) {
    query += ' LIMIT ?'
    params.push(options.limit)
  }
  if (options?.offset) {
    query += ' OFFSET ?'
    params.push(options.offset)
  }

  const stmt = db.prepare(query)
  return stmt.all(...params) as any[]
}

export function getTradeStats(accountId: string) {
  const totalTrades = db.prepare('SELECT COUNT(*) as count FROM trades WHERE account_id = ?').get(accountId) as any
  const winningTrades = db.prepare('SELECT COUNT(*) as count FROM trades WHERE account_id = ? AND profit > 0').get(accountId) as any
  const losingTrades = db.prepare('SELECT COUNT(*) as count FROM trades WHERE account_id = ? AND profit < 0').get(accountId) as any
  const totalProfit = db.prepare('SELECT COALESCE(SUM(profit), 0) as total FROM trades WHERE account_id = ?').get(accountId) as any

  const avgWin = db.prepare('SELECT COALESCE(AVG(profit), 0) as avg FROM trades WHERE account_id = ? AND profit > 0').get(accountId) as any
  const avgLoss = db.prepare('SELECT COALESCE(AVG(profit), 0) as avg FROM trades WHERE account_id = ? AND profit < 0').get(accountId) as any

  const profitFactor = Math.abs(avgLoss.avg) > 0 ? avgWin.avg / Math.abs(avgLoss.avg) : avgWin.avg

  return {
    totalTrades: totalTrades.count,
    winningTrades: winningTrades.count,
    losingTrades: losingTrades.count,
    winRate: totalTrades.count > 0 ? (winningTrades.count / totalTrades.count) * 100 : 0,
    totalProfit: totalProfit.total,
    averageWin: avgWin.avg,
    averageLoss: avgLoss.avg,
    profitFactor,
    largestWin: db.prepare('SELECT MAX(profit) as max FROM trades WHERE account_id = ? AND profit > 0').get(accountId) as any,
    largestLoss: db.prepare('SELECT MIN(profit) as min FROM trades WHERE account_id = ? AND profit < 0').get(accountId) as any,
    averageTradeDuration: db.prepare('SELECT AVG(duration_seconds) as avg FROM trades WHERE duration_seconds IS NOT NULL').get(accountId) as any,
  }
}

export { db }
