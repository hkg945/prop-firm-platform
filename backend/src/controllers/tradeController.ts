import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middleware/auth'
import { query } from '../db'
import { Trade, PaginatedResponse } from '../types'

export const getTrades = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { accountId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 20
    const offset = (page - 1) * pageSize
    const symbol = req.query.symbol as string
    const status = req.query.status as string
    const startDate = req.query.startDate as string
    const endDate = req.query.endDate as string

    let whereClause = `
      FROM trades t
      JOIN accounts a ON t.account_id = a.id
      WHERE a.user_id = $1
    `
    const params: any[] = [userId]
    let paramIndex = 2

    if (accountId) {
      whereClause += ` AND t.account_id = $${paramIndex}`
      params.push(accountId)
      paramIndex++
    }

    if (symbol) {
      whereClause += ` AND t.symbol = $${paramIndex}`
      params.push(symbol)
      paramIndex++
    }

    if (status) {
      whereClause += ` AND t.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (startDate) {
      whereClause += ` AND t.entry_time >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      whereClause += ` AND t.entry_time <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    const result = await query(
      `SELECT t.id, t.account_id, t.mt4_ticket, t.symbol, t.direction,
              t.volume, t.entry_price, t.exit_price, t.entry_time,
              t.exit_time, t.pnl, t.pnl_percentage, t.swap, t.commission,
              t.duration_minutes, t.status, t.tp_level, t.sl_level,
              t.created_at, t.updated_at, a.account_number
       ${whereClause}
       ORDER BY t.entry_time DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, pageSize, offset]
    )

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) ${whereClause}`,
      params
    )

    const total = parseInt(countResult.rows[0].count, 10)

    res.json({
      success: true,
      data: {
        data: result.rows.map((row) => ({
          id: row.id,
          accountId: row.account_id,
          mt4Ticket: row.mt4_ticket,
          symbol: row.symbol,
          direction: row.direction,
          volume: parseFloat(row.volume),
          entryPrice: parseFloat(row.entry_price),
          exitPrice: row.exit_price ? parseFloat(row.exit_price) : undefined,
          entryTime: row.entry_time,
          exitTime: row.exit_time,
          pnl: parseFloat(row.pnl),
          pnlPercentage: parseFloat(row.pnl_percentage),
          swap: parseFloat(row.swap),
          commission: parseFloat(row.commission),
          durationMinutes: row.duration_minutes,
          status: row.status,
          tpLevel: row.tp_level ? parseFloat(row.tp_level) : undefined,
          slLevel: row.sl_level ? parseFloat(row.sl_level) : undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          accountNumber: row.account_number,
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      } as PaginatedResponse<Trade>,
    })
  } catch (error) {
    next(error)
  }
}

export const getTradeStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { accountId } = req.params

    let whereClause = `
      FROM trades t
      JOIN accounts a ON t.account_id = a.id
      WHERE a.user_id = $1 AND t.status = 'closed'
    `
    const params: any[] = [userId]

    if (accountId) {
      whereClause += ` AND t.account_id = $2`
      params.push(accountId)
    }

    const result = await query(
      `SELECT
         COUNT(*) as total_trades,
         COUNT(*) FILTER (WHERE pnl > 0) as winning_trades,
         COUNT(*) FILTER (WHERE pnl <= 0) as losing_trades,
         AVG(pnl) FILTER (WHERE pnl > 0) as avg_win,
         AVG(pnl) FILTER (WHERE pnl <= 0) as avg_loss,
         SUM(pnl) as total_pnl,
         AVG(pnl_percentage) as avg_pnl_percentage,
         AVG(duration_minutes) as avg_duration,
         MAX(duration_minutes) as max_duration,
         MIN(duration_minutes) as min_duration
       ${whereClause}`,
      params
    )

    const row = result.rows[0]

    const winningTrades = parseInt(row.winning_trades, 10) || 0
    const totalTrades = parseInt(row.total_trades, 10) || 0
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    const avgWin = parseFloat(row.avg_win) || 0
    const avgLoss = Math.abs(parseFloat(row.avg_loss) || 0)
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0

    res.json({
      success: true,
      data: {
        totalTrades,
        winningTrades,
        losingTrades: totalTrades - winningTrades,
        winRate: parseFloat(winRate.toFixed(2)),
        averageWin: parseFloat(avgWin.toFixed(2)),
        averageLoss: parseFloat(avgLoss.toFixed(2)),
        profitFactor: parseFloat(profitFactor.toFixed(2)),
        totalPnL: parseFloat(row.total_pnl) || 0,
        averagePnLPercentage: parseFloat(row.avg_pnl_percentage) || 0,
        averageDuration: Math.round(parseFloat(row.avg_duration) || 0),
        maxDuration: parseInt(row.max_duration, 10) || 0,
        minDuration: parseInt(row.min_duration, 10) || 0,
      },
    })
  } catch (error) {
    next(error)
  }
}
