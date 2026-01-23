import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middleware/auth'
import { query } from '../db'
import { Account, PaginatedResponse } from '../types'

export const getAccounts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10
    const offset = (page - 1) * pageSize

    const result = await query(
      `SELECT id, user_id, account_number, type, phase, status,
              starting_balance, balance, equity, margin, free_margin,
              profit, profit_target, profit_percentage,
              max_drawdown, daily_drawdown, current_drawdown,
              max_drawdown_used, daily_drawdown_used,
              challenge_started_at, created_at, updated_at
       FROM accounts
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, pageSize, offset]
    )

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*) FROM accounts WHERE user_id = $1 AND deleted_at IS NULL',
      [userId]
    )

    const total = parseInt(countResult.rows[0].count, 10)

    res.json({
      success: true,
      data: {
        data: result.rows.map((row) => ({
          id: row.id,
          userId: row.user_id,
          accountNumber: row.account_number,
          type: row.type,
          phase: row.phase,
          status: row.status,
          startingBalance: parseFloat(row.starting_balance),
          balance: parseFloat(row.balance),
          equity: parseFloat(row.equity),
          margin: parseFloat(row.margin),
          freeMargin: parseFloat(row.free_margin),
          profit: parseFloat(row.profit),
          profitTarget: parseFloat(row.profit_target),
          profitPercentage: parseFloat(row.profit_percentage),
          maxDrawdown: parseFloat(row.max_drawdown),
          dailyDrawdown: parseFloat(row.daily_drawdown),
          currentDrawdown: parseFloat(row.current_drawdown),
          maxDrawdownUsed: parseFloat(row.max_drawdown_used),
          dailyDrawdownUsed: parseFloat(row.daily_drawdown_used),
          challengeStartedAt: row.challenge_started_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      } as PaginatedResponse<Account>,
    })
  } catch (error) {
    next(error)
  }
}

export const getAccountById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const result = await query(
      `SELECT id, user_id, account_number, type, phase, status,
              starting_balance, balance, equity, margin, free_margin,
              profit, profit_target, profit_percentage,
              max_drawdown, daily_drawdown, current_drawdown,
              max_drawdown_used, daily_drawdown_used,
              challenge_started_at, created_at, updated_at
       FROM accounts
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Account not found',
      })
      return
    }

    const row = result.rows[0]

    res.json({
      success: true,
      data: {
        id: row.id,
        userId: row.user_id,
        accountNumber: row.account_number,
        type: row.type,
        phase: row.phase,
        status: row.status,
        startingBalance: parseFloat(row.starting_balance),
        balance: parseFloat(row.balance),
        equity: parseFloat(row.equity),
        margin: parseFloat(row.margin),
        freeMargin: parseFloat(row.free_margin),
        profit: parseFloat(row.profit),
        profitTarget: parseFloat(row.profit_target),
        profitPercentage: parseFloat(row.profit_percentage),
        maxDrawdown: parseFloat(row.max_drawdown),
        dailyDrawdown: parseFloat(row.daily_drawdown),
        currentDrawdown: parseFloat(row.current_drawdown),
        maxDrawdownUsed: parseFloat(row.max_drawdown_used),
        dailyDrawdownUsed: parseFloat(row.daily_drawdown_used),
        challengeStartedAt: row.challenge_started_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAccountStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const result = await query(
      `SELECT 
         COUNT(*) FILTER (WHERE status = 'active') as active_accounts,
         COUNT(*) as total_accounts,
         SUM(profit) as total_profit,
         COUNT(CASE WHEN profit > 0 THEN 1 END) as winning_trades_count,
         COUNT(*) FILTER (WHERE status = 'closed') as total_closed_trades
       FROM accounts
       WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    )

    const row = result.rows[0]

    res.json({
      success: true,
      data: {
        activeAccounts: parseInt(row.active_accounts, 10) || 0,
        totalAccounts: parseInt(row.total_accounts, 10) || 0,
        totalProfit: parseFloat(row.total_profit) || 0,
        winningTradesCount: parseInt(row.winning_trades_count, 10) || 0,
        totalClosedTrades: parseInt(row.total_closed_trades, 10) || 0,
      },
    })
  } catch (error) {
    next(error)
  }
}
