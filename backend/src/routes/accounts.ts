import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getAccounts, getAccountById, getAccountStats } from '../controllers/accountController'

const router = Router()

router.use(authenticate)

router.get('/', getAccounts)
router.get('/stats', getAccountStats)
router.get('/:id', getAccountById)

export default router
