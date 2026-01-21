import { Router } from 'express'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'
import {
  getOpenPositions,
  getPositionById,
  updatePosition,
  closePosition,
  createTrade,
  getAccountById,
  getSymbolBySymbol,
  updateAccountMetrics,
  getTrades,
  getTradeStats,
} from '../db/sqlite'

const router = Router()

router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const positions = getOpenPositions(account.id)

    res.json({ success: true, data: { positions } })
  } catch (error) {
    console.error('Get positions error:', error)
    res.status(500).json({ success: false, error: 'Failed to get positions' })
  }
})

router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const position = getPositionById(req.params.id)
    if (!position) {
      return res.status(404).json({ success: false, error: 'Position not found' })
    }

    res.json({ success: true, data: { position } })
  } catch (error) {
    console.error('Get position error:', error)
    res.status(500).json({ success: false, error: 'Failed to get position' })
  }
})

router.patch('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { sl, tp } = req.body
    const position = getPositionById(req.params.id)

    if (!position) {
      return res.status(404).json({ success: false, error: 'Position not found' })
    }

    if (position.status !== 'open') {
      return res.status(400).json({ success: false, error: 'Cannot modify closed position' })
    }

    const updated = updatePosition(req.params.id, {
      sl: sl !== undefined ? sl : undefined,
      tp: tp !== undefined ? tp : undefined,
    })

    res.json({ success: true, data: { position: updated } })
  } catch (error) {
    console.error('Update position error:', error)
    res.status(500).json({ success: false, error: 'Failed to update position' })
  }
})

router.post('/:id/close', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const position = getPositionById(req.params.id)

    if (!position) {
      return res.status(404).json({ success: false, error: 'Position not found' })
    }

    if (position.status !== 'open') {
      return res.status(400).json({ success: false, error: 'Position already closed' })
    }

    const symbol = getSymbolBySymbol(position.symbol)
    const currentPrice = position.side === 'long'
      ? position.openPrice - symbol.pip_size * 10
      : position.openPrice + symbol.pip_size * 10

    const closePrice = position.side === 'long' ? currentPrice : currentPrice
    const profit = position.side === 'long'
      ? (closePrice - position.openPrice) * position.volume * 100000 / symbol.pip_size
      : (position.openPrice - closePrice) * position.volume * 100000 / symbol.pip_size

    const closedPosition = closePosition(req.params.id, closePrice, profit)

    const account = getAccountByUserId(req.user!.id)
    if (account) {
      const durationSeconds = Math.floor(
        (new Date().getTime() - new Date(position.opened_at).getTime()) / 1000
      )

      const pips = position.side === 'long'
        ? (closePrice - position.openPrice) / symbol.pip_size
        : (position.openPrice - closePrice) / symbol.pip_size

      createTrade({
        id: `trade_${Date.now()}`,
        accountId: account.id,
        userId: req.user!.id,
        positionId: position.id,
        orderId: position.order_id,
        symbol: position.symbol,
        side: position.side,
        type: 'market',
        volume: position.volume,
        openPrice: position.open_price,
        closePrice,
        sl: position.sl || undefined,
        tp: position.tp || undefined,
        profit,
        pips,
        durationSeconds,
        openedAt: position.opened_at,
        closedAt: new Date().toISOString(),
      })

      updateAccountMetrics(account.id)
    }

    res.json({ success: true, data: { position: closedPosition, profit } })
  } catch (error) {
    console.error('Close position error:', error)
    res.status(500).json({ success: false, error: 'Failed to close position' })
  }
})

router.post('/close-all', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const positions = getOpenPositions(account.id)
    const results: any[] = []

    for (const position of positions) {
      const symbol = getSymbolBySymbol(position.symbol)
      const currentPrice = position.side === 'long'
        ? position.openPrice - symbol.pip_size * 10
        : position.openPrice + symbol.pip_size * 10

      const closePrice = currentPrice
      const profit = position.side === 'long'
        ? (closePrice - position.open_price) * position.volume * 100000 / symbol.pip_size
        : (position.open_price - closePrice) * position.volume * 100000 / symbol.pip_size

      closePosition(position.id, closePrice, profit)

      const durationSeconds = Math.floor(
        (new Date().getTime() - new Date(position.opened_at).getTime()) / 1000
      )

      const pips = position.side === 'long'
        ? (closePrice - position.open_price) / symbol.pip_size
        : (position.open_price - closePrice) / symbol.pip_size

      createTrade({
        id: `trade_${Date.now()}_${position.id}`,
        accountId: account.id,
        userId: req.user!.id,
        positionId: position.id,
        orderId: position.order_id,
        symbol: position.symbol,
        side: position.side,
        type: 'market',
        volume: position.volume,
        openPrice: position.open_price,
        closePrice,
        sl: position.sl || undefined,
        tp: position.tp || undefined,
        profit,
        pips,
        durationSeconds,
        openedAt: position.opened_at,
        closedAt: new Date().toISOString(),
      })

      results.push({ positionId: position.id, profit })
    }

    updateAccountMetrics(account.id)

    res.json({ success: true, data: { closed: results.length, results } })
  } catch (error) {
    console.error('Close all positions error:', error)
    res.status(500).json({ success: false, error: 'Failed to close positions' })
  }
})

router.get('/trades/history', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const { limit, offset, symbol } = req.query as { limit?: string; offset?: string; symbol?: string }
    const trades = getTrades(account.id, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      symbol,
    })

    res.json({ success: true, data: { trades } })
  } catch (error) {
    console.error('Get trade history error:', error)
    res.status(500).json({ success: false, error: 'Failed to get trade history' })
  }
})

router.get('/trades/stats', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const stats = getTradeStats(account.id)

    res.json({ success: true, data: { stats } })
  } catch (error) {
    console.error('Get trade stats error:', error)
    res.status(500).json({ success: false, error: 'Failed to get trade stats' })
  }
})

export default router

function getAccountByUserId(userId: string): any {
  const { getAccountByUserId: getAccount } = require('../db/sqlite')
  return getAccount(userId)
}
