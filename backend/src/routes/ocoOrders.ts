import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'
import {
  createOrder,
  getOrdersByAccount,
  getOrderById,
  deleteOrder,
  getAccountById,
  getSymbolBySymbol,
  updateOrderStatus,
  getPositionById,
  createPosition,
  closePosition,
  createTrade,
  updateAccountMetrics,
} from '../db/sqlite'

const router = Router()

const ocoOrderSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  volume: z.number().positive(),
  sl: z.number(),
  tp: z.number(),
  slOrderType: z.enum(['stop', 'stop_limit']).optional().default('stop'),
  tpOrderType: z.enum(['limit', 'stop_limit']).optional().default('limit'),
  slPrice: z.number().optional(),
  slStopPrice: z.number().optional(),
  tpPrice: z.number().optional(),
  tpStopPrice: z.number().optional(),
  comment: z.string().optional(),
  timeInForce: z.enum(['gtc', 'day', 'ioc', 'fok']).optional(),
})

const ocoocoOrderSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  volume: z.number().positive(),
  primary: z.object({
    sl: z.number(),
    tp: z.number(),
    slOrderType: z.enum(['stop', 'stop_limit']).optional().default('stop'),
    tpOrderType: z.enum(['limit', 'stop_limit']).optional().default('limit'),
    slPrice: z.number().optional(),
    slStopPrice: z.number().optional(),
    tpPrice: z.number().optional(),
    tpStopPrice: z.number().optional(),
  }),
  secondary: z.object({
    sl: z.number(),
    tp: z.number(),
    slOrderType: z.enum(['stop', 'stop_limit']).optional().default('stop'),
    tpOrderType: z.enum(['limit', 'stop_limit']).optional().default('limit'),
    slPrice: z.number().optional(),
    slStopPrice: z.number().optional(),
    tpPrice: z.number().optional(),
    tpStopPrice: z.number().optional(),
  }),
  comment: z.string().optional(),
  timeInForce: z.enum(['gtc', 'day', 'ioc', 'fok']).optional(),
})

router.post('/oco', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const data = ocoOrderSchema.parse(req.body)

    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const symbol = getSymbolBySymbol(data.symbol)
    if (!symbol) {
      return res.status(400).json({ success: false, error: 'Invalid symbol' })
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

    const groupId = uuidv4()

    const slOrderId = uuidv4()
    const tpOrderId = uuidv4()

    const basePrice = data.side === 'buy' ? 1.0850 : 1.0840

    const slStopPrice = data.slPrice || (data.side === 'buy' ? basePrice - data.sl * symbol.pip_size : basePrice + data.sl * symbol.pip_size)
    const tpLimitPrice = data.tpPrice || (data.side === 'buy' ? basePrice + data.tp * symbol.pip_size : basePrice - data.tp * symbol.pip_size)

    createOrder({
      id: slOrderId,
      accountId: account.id,
      userId: req.user!.id,
      symbol: data.symbol,
      side: data.side,
      type: data.slOrderType,
      volume: data.volume,
      stopPrice: slStopPrice,
      sl: data.sl,
      tp: data.tp,
      comment: data.comment || 'OCO SL Order',
      timeInForce: data.timeInForce,
      parentOrderId: groupId,
    })

    createOrder({
      id: tpOrderId,
      accountId: account.id,
      userId: req.user!.id,
      symbol: data.symbol,
      side: data.side,
      type: data.tpOrderType,
      volume: data.volume,
      limitPrice: tpLimitPrice,
      sl: data.sl,
      tp: data.tp,
      comment: data.comment || 'OCO TP Order',
      timeInForce: data.timeInForce,
      parentOrderId: groupId,
    })

    res.status(201).json({
      success: true,
      data: {
        ocoGroupId: groupId,
        orders: [
          { id: slOrderId, type: 'stop', sl: data.sl },
          { id: tpOrderId, type: 'limit', tp: data.tp },
        ],
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation error', details: error.errors })
    }
    console.error('Create OCO error:', error)
    res.status(500).json({ success: false, error: 'Failed to create OCO orders' })
  }
})

router.post('/ocooco', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const data = ocoocoOrderSchema.parse(req.body)

    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const symbol = getSymbolBySymbol(data.symbol)
    if (!symbol) {
      return res.status(400).json({ success: false, error: 'Invalid symbol' })
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

    const groupId = uuidv4()

    const orders: any[] = []

    const basePrice = data.side === 'buy' ? 1.0850 : 1.0840

    const createOCOOrders = (label: string, params: typeof data.primary) => {
      const slStopPrice = params.slPrice || (data.side === 'buy' ? basePrice - params.sl * symbol.pip_size : basePrice + params.sl * symbol.pip_size)
      const tpLimitPrice = params.tpPrice || (data.side === 'buy' ? basePrice + params.tp * symbol.pip_size : basePrice - params.tp * symbol.pip_size)

      const slOrderId = uuidv4()
      const tpOrderId = uuidv4()

      createOrder({
        id: slOrderId,
        accountId: account.id,
        userId: req.user!.id,
        symbol: data.symbol,
        side: data.side,
        type: params.slOrderType,
        volume: data.volume,
        stopPrice: slStopPrice,
        sl: params.sl,
        tp: params.tp,
        comment: data.comment || `OCOOCO ${label} SL`,
        timeInForce: data.timeInForce,
        parentOrderId: groupId,
      })

      createOrder({
        id: tpOrderId,
        accountId: account.id,
        userId: req.user!.id,
        symbol: data.symbol,
        side: data.side,
        type: params.tpOrderType,
        volume: data.volume,
        limitPrice: tpLimitPrice,
        sl: params.sl,
        tp: params.tp,
        comment: data.comment || `OCOOCO ${label} TP`,
        timeInForce: data.timeInForce,
        parentOrderId: groupId,
      })

      orders.push(
        { id: slOrderId, type: 'stop', label, side: 'sl' },
        { id: tpOrderId, type: 'limit', label, side: 'tp' }
      )
    }

    createOCOOrders('primary', data.primary)
    createOCOOrders('secondary', data.secondary)

    res.status(201).json({
      success: true,
      data: {
        ocoocoGroupId: groupId,
        orders,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation error', details: error.errors })
    }
    console.error('Create OCOOCO error:', error)
    res.status(500).json({ success: false, error: 'Failed to create OCOOCO orders' })
  }
})

router.get('/oco-groups', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const orders = getOrdersByAccount(account.id)

    const groups = new Map<string, any>()

    orders.forEach((order: any) => {
      if (order.parent_order_id) {
        if (!groups.has(order.parent_order_id)) {
          groups.set(order.parent_order_id, {
            id: order.parent_order_id,
            orders: [],
            status: 'active',
          })
        }
        groups.get(order.parent_order_id).orders.push(order)
      }
    })

    const ocoGroups = Array.from(groups.values()).map((group: any) => {
      const hasFilledOrder = group.orders.some((o: any) => o.status === 'filled')
      return {
        ...group,
        status: hasFilledOrder ? 'partially_filled' : group.orders.every((o: any) => o.status === 'cancelled') ? 'cancelled' : 'active',
      }
    })

    res.json({ success: true, data: { ocoGroups } })
  } catch (error) {
    console.error('Get OCO groups error:', error)
    res.status(500).json({ success: false, error: 'Failed to get OCO groups' })
  }
})

router.post('/oco-group/:groupId/cancel', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { groupId } = req.params

    const account = getAccountByUserId(req.user!.id)
    if (!account) {
      return res.status(404).json({ success: false, error: 'Account not found' })
    }

    const orders = getOrdersByAccount(account.id)
    const groupOrders = orders.filter((o: any) => o.parent_order_id === groupId)

    let cancelledCount = 0
    groupOrders.forEach((order: any) => {
      if (order.status === 'pending') {
        deleteOrder(order.id)
        cancelledCount++
      }
    })

    res.json({
      success: true,
      message: `Cancelled ${cancelledCount} orders`,
    })
  } catch (error) {
    console.error('Cancel OCO group error:', error)
    res.status(500).json({ success: false, error: 'Failed to cancel OCO group' })
  }
})

function getAccountByUserId(userId: string): any {
  const { getAccountByUserId: getAccount } = require('../db/sqlite')
  return getAccount(userId)
}

export default router
