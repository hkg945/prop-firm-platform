import { Router } from 'express'
import accountRoutes from './accounts'
import tradeRoutes from './trades'
import ruleRoutes from './rules'

const router = Router()

router.use('/accounts', accountRoutes)
router.use('/trades', tradeRoutes)
router.use('/rules', ruleRoutes)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
