import { Response, NextFunction, Request } from 'express'
import { query } from '../db'
import { ChallengeRule } from '../types'

export const getRules = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await query<ChallengeRule>(
      `SELECT id, type, name, description, account_size, price,
              profit_target, max_drawdown, daily_drawdown,
              min_trading_days, duration_days, is_active,
              created_at, updated_at
       FROM challenge_rules
       ORDER BY price ASC`
    )

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        id: row.id,
        type: row.type,
        name: row.name,
        description: row.description,
        accountSize: parseFloat(row.account_size),
        price: parseFloat(row.price),
        profitTarget: parseFloat(row.profit_target),
        maxDrawdown: parseFloat(row.max_drawdown),
        dailyDrawdown: parseFloat(row.daily_drawdown),
        minTradingDays: row.min_trading_days,
        durationDays: row.duration_days,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    })
  } catch (error) {
    next(error)
  }
}

export const getRuleByType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params

    const result = await query(
      `SELECT id, type, name, description, account_size, price,
              profit_target, max_drawdown, daily_drawdown,
              min_trading_days, duration_days, is_active,
              created_at, updated_at
       FROM challenge_rules
       WHERE type = $1`,
      [type]
    )

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Rule not found',
      })
      return
    }

    const row = result.rows[0]

    res.json({
      success: true,
      data: {
        id: row.id,
        type: row.type,
        name: row.name,
        description: row.description,
        accountSize: parseFloat(row.account_size),
        price: parseFloat(row.price),
        profitTarget: parseFloat(row.profit_target),
        maxDrawdown: parseFloat(row.max_drawdown),
        dailyDrawdown: parseFloat(row.daily_drawdown),
        minTradingDays: row.min_trading_days,
        durationDays: row.duration_days,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
}
