import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'
import {
  createOrder,
  getOrdersByAccount,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  createPosition,
  getAccountById,
  getAccountByUserId,
  getSymbolBySymbol,
  getOpenPositions,
  closePosition,
  createTrade,
  updateAccountMetrics,
} from '../db/sqlite'

const router = Router()

const createOrderSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit', 'stop', 'stop_limit']),
  volume: z.number().positive(),
  price: z.number().optional(),
  stopPrice: z.number().optional(),
  limitPrice: z.number().optional(),
  sl: z.number().optional(),
  tp: z.number().optional(),
  comment: z.string().optional(),
  timeInForce: z.enum(['gtc', 'day', 'ioc', 'fok']).optional(),
  expiresAt: z.string().optional(),
})

router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const { status } = req.query as { status?: string }
    const orders = getOrdersByAccount(account.id, status)

    res.json({ success: true, data: { orders } })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ success: false, error: 'Failed to get orders' })
  }
})

router.get('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const order = getOrderById(req.params.id)
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    res.json({ success: true, data: { order } })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ success: false, error: 'Failed to get order' })
  }
})

router.post('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const data = createOrderSchema.parse(req.body)

    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const symbol = getSymbolBySymbol(data.symbol)
    if (!symbol) {
      return res.status(400).json({ success: false, error: 'Invalid symbol' })
    }

    if (data.volume < symbol.min_lot || data.volume > symbol.max_lot) {
      return res.status(400).json({
        success: false,
        error: `Volume must be between ${symbol.min_lot} and ${symbol.max_lot} lots`,
      })
    }

    const marginRequired = data.volume * 1000
    if (account.free_margin < marginRequired) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient margin',
        required: marginRequired,
        available: account.free_margin,
      })
    }

    const order = createOrder({
      id: uuidv4(),
      accountId: account.id,
      userId: req.user!.id,
      symbol: data.symbol,
      side: data.side,
      type: data.type,
      volume: data.volume,
      price: data.price,
      stopPrice: data.stopPrice,
      limitPrice: data.limitPrice,
      sl: data.sl,
      tp: data.tp,
      comment: data.comment,
      timeInForce: data.timeInForce,
      expiresAt: data.expiresAt,
    })

    if (data.type === 'market') {
      const currentPrice = data.side === 'buy' ? 1.0850 + symbol.pip_size : 1.0850
      const filledPrice = data.side === 'buy' ? currentPrice + symbol.pip_size * 2 : currentPrice - symbol.pip_size * 2

      const position = createPosition({
        id: uuidv4(),
        accountId: account.id,
        userId: req.user!.id,
        orderId: order.id,
        symbol: data.symbol,
        side: data.side === 'buy' ? 'long' : 'short',
        volume: data.volume,
        openPrice: filledPrice,
        sl: data.sl,
        tp: data.tp,
      })

      updateOrderStatus(order.id, 'filled', data.volume)

      updateAccountMetrics(account.id)

      res.json({
        success: true,
        data: {
          order: { ...order, status: 'filled' },
          position,
        },
      })
    } else {
      res.status(201).json({
        success: true,
        data: { order },
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation error', details: error.errors })
    }
    console.error('Create order error:', error)
    res.status(500).json({ success: false, error: 'Failed to create order' })
  }
})

router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const order = getOrderById(req.params.id)
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Only pending orders can be cancelled' })
    }

    deleteOrder(order.id)

    res.json({ success: true, message: 'Order cancelled successfully' })
  } catch (error) {
    console.error('Cancel order error:', error)
    res.status(500).json({ success: false, error: 'Failed to cancel order' })
  }
})

router.post('/:id/cancel', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const order = getOrderById(req.params.id)
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Only pending orders can be cancelled' })
    }

    deleteOrder(order.id)

    res.json({ success: true, message: 'Order cancelled successfully' })
  } catch (error) {
    console.error('Cancel order error:', error)
    res.status(500).json({ success: false, error: 'Failed to cancel order' })
  }
})

export default router
