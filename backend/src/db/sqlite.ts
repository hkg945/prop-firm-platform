import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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
      balance REAL DEFAULT 0,
      equity REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      type TEXT NOT NULL,
      volume REAL NOT NULL,
      open_price REAL NOT NULL,
      close_price REAL,
      stop_loss REAL,
      take_profit REAL,
      profit REAL DEFAULT 0,
      status TEXT DEFAULT 'open',
      opened_at TEXT NOT NULL,
      closed_at TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    )
  `)

  console.log('Database initialized successfully')
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
    user.id,
    user.email,
    user.passwordHash,
    user.firstName,
    user.lastName,
    user.phone || null,
    user.country || null,
    user.timezone || 'UTC',
    now,
    now
  )

  return getUserById(user.id)
}

export function updateLastLogin(userId: string) {
  const stmt = db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
  const now = new Date().toISOString()
  stmt.run(now, userId)
}

export { db }
