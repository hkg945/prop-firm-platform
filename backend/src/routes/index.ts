import { Router } from 'express'
import accountRoutes from './accounts'
import tradeRoutes from './trades'
import ruleRoutes from './rules'
import authRoutes from './auth'

const router = Router()

router.use('/v1/auth', authRoutes)
router.use('/v1/accounts', accountRoutes)
router.use('/v1/trades', tradeRoutes)
router.use('/v1/rules', ruleRoutes)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
