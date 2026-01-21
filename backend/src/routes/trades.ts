import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getTrades, getTradeStats } from '../controllers/tradeController'

const router = Router()

router.use(authenticate)

router.get('/', getTrades)
router.get('/stats', getTradeStats)

export default router
