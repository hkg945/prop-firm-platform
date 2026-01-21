import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { getRules, getRuleByType } from '../controllers/ruleController'

const router = Router()

router.get('/', getRules)
router.get('/:type', getRuleByType)

export default router
