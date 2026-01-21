import { Router } from 'express'
import accountRoutes from './accounts'
import tradeRoutes from './trades'
import ruleRoutes from './rules'
import authRoutes from './auth'
import orderRoutes from './orders'
import positionRoutes from './positions'
import ocoRoutes from './ocoOrders'

const router = Router()

router.use('/v1/auth', authRoutes)
router.use('/v1/accounts', accountRoutes)
router.use('/v1/trades', tradeRoutes)
router.use('/v1/rules', ruleRoutes)
router.use('/v1/orders', orderRoutes)
router.use('/v1/positions', positionRoutes)
router.use('/v1/oco', ocoRoutes)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
