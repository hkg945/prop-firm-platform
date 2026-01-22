'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Symbol,
  Quote,
  Position,
  Order,
  OrderFormData,
  Account,
  RiskCalculation,
  ChartInterval,
} from '@/types/trading'
import {
  FOREX_PAIRS,
  CRYPTO_PAIRS,
  INDICES,
  COMMODITIES,
  generateMockQuote,
  generateMockAccount,
} from '@/data/mockTradingData'

interface TradingState {
  currentSymbol: Symbol | null
  symbols: Symbol[]
  quotes: Record<string, Quote>
  positions: Position[]
  pendingOrders: Order[]
  account: Account | null
  selectedInterval: ChartInterval
  isConnected: boolean
  lastUpdate: string | null
}

type TradingAction =
  | { type: 'SET_CURRENT_SYMBOL'; payload: Symbol }
  | { type: 'SET_SYMBOLS'; payload: Symbol[] }
  | { type: 'UPDATE_QUOTE'; payload: { symbol: string; quote: Quote } }
  | { type: 'SET_POSITIONS'; payload: Position[] }
  | { type: 'ADD_POSITION'; payload: Position }
  | { type: 'UPDATE_POSITION'; payload: { id: string; updates: Partial<Position> } }
  | { type: 'UPDATE_POSITION_PRICE'; payload: { symbol: string; bid: number; ask: number } }
  | { type: 'REMOVE_POSITION'; payload: string }
  | { type: 'SET_PENDING_ORDERS'; payload: Order[] }
  | { type: 'ADD_PENDING_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'REMOVE_ORDER'; payload: string }
  | { type: 'SET_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Partial<Account> }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_INTERVAL'; payload: ChartInterval }

const initialState: TradingState = {
  currentSymbol: null,
  symbols: [],
  quotes: {},
  positions: [],
  pendingOrders: [],
  account: null,
  selectedInterval: '60',
  isConnected: false,
  lastUpdate: null,
}

function calculatePositionProfit(
  position: Position,
  currentBid: number,
  currentAsk: number,
  symbol: Symbol
): { profit: number; profitPercent: number; currentPrice: number } {
  const isLong = position.side === 'long'
  const currentPrice = isLong ? currentAsk : currentBid
  const priceDiff = isLong
    ? currentPrice - position.openPrice
    : position.openPrice - currentPrice

  const pipValue = position.volume * 10 * symbol.pipSize
  const profit = priceDiff * pipValue
  const profitPercent = (profit / (position.openPrice * position.volume * 1000)) * 100

  return { profit, profitPercent, currentPrice }
}

function tradingReducer(state: TradingState, action: TradingAction): TradingState {
  switch (action.type) {
    case 'SET_CURRENT_SYMBOL':
      return { ...state, currentSymbol: action.payload }

    case 'SET_SYMBOLS':
      return { ...state, symbols: action.payload }

    case 'UPDATE_QUOTE':
      return {
        ...state,
        quotes: {
          ...state.quotes,
          [action.payload.symbol]: action.payload.quote,
        },
        lastUpdate: new Date().toISOString(),
      }

    case 'UPDATE_POSITION_PRICE': {
      const symbol = state.symbols.find(s => s.symbol === action.payload.symbol)
      if (!symbol) return state

      const updatedPositions = state.positions.map(position => {
        if (position.symbol !== action.payload.symbol || position.status !== 'open') {
          return position
        }

        const { profit, profitPercent, currentPrice } = calculatePositionProfit(
          position,
          action.payload.bid,
          action.payload.ask,
          symbol
        )

        return {
          ...position,
          currentPrice,
          profit,
          profitPercent,
        }
      })

      const totalProfit = updatedPositions.reduce((sum, p) => sum + (p.profit || 0), 0)

      return {
        ...state,
        positions: updatedPositions,
        account: state.account ? {
          ...state.account,
          equity: state.account.balance + totalProfit,
          profit: totalProfit,
          profitPercent: (totalProfit / state.account.balance) * 100,
        } : null,
        lastUpdate: new Date().toISOString(),
      }
    }

    case 'SET_POSITIONS':
      return { ...state, positions: action.payload }

    case 'ADD_POSITION':
      return { ...state, positions: [...state.positions, action.payload] }

    case 'UPDATE_POSITION':
      return {
        ...state,
        positions: state.positions.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      }

    case 'REMOVE_POSITION':
      return {
        ...state,
        positions: state.positions.filter((p) => p.id !== action.payload),
      }

    case 'SET_PENDING_ORDERS':
      return { ...state, pendingOrders: action.payload }

    case 'ADD_PENDING_ORDER':
      return {
        ...state,
        pendingOrders: [...state.pendingOrders, action.payload],
      }

    case 'UPDATE_ORDER':
      return {
        ...state,
        pendingOrders: state.pendingOrders.map((o) =>
          o.id === action.payload.id ? { ...o, ...action.payload.updates } : o
        ),
      }

    case 'REMOVE_ORDER':
      return {
        ...state,
        pendingOrders: state.pendingOrders.filter((o) => o.id !== action.payload),
      }

    case 'SET_ACCOUNT':
      return { ...state, account: action.payload }

    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        account: state.account
          ? { ...state.account, ...action.payload }
          : null,
      }

    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload }

    case 'SET_INTERVAL':
      return { ...state, selectedInterval: action.payload }

    default:
      return state
  }
}

interface OCOOrderData {
  symbol: string
  side: 'buy' | 'sell'
  volume: number
  sl: number
  tp: number
  comment?: string
  timeInForce?: string
}

interface TradingContextValue {
  state: TradingState
  selectSymbol: (symbol: Symbol) => void
  setSymbols: (symbols: Symbol[]) => void
  updateQuote: (symbol: string, quote: Quote) => void
  setPositions: (positions: Position[]) => void
  addPosition: (position: Position) => void
  updatePosition: (id: string, updates: Partial<Position>) => void
  closePosition: (id: string) => void
  setPendingOrders: (orders: Order[]) => void
  submitOrder: (order: OrderFormData) => void
  submitOCOOrder: (order: OCOOrderData) => void
  cancelOrder: (id: string) => void
  modifyPosition: (id: string, updates: { sl?: number; tp?: number }) => void
  setAccount: (account: Account) => void
  setInterval: (interval: ChartInterval) => void
  calculateRisk: (volume: number, sl?: number) => RiskCalculation | null
  loadPositions: () => Promise<void>
  loadAccount: () => Promise<void>
  pendingOrder: boolean
}

const TradingContext = createContext<TradingContextValue | null>(null)

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1'

  const selectSymbol = useCallback((symbol: Symbol) => {
    dispatch({ type: 'SET_CURRENT_SYMBOL', payload: symbol })
  }, [])

  const setSymbols = useCallback((symbols: Symbol[]) => {
    dispatch({ type: 'SET_SYMBOLS', payload: symbols })
  }, [])

  const updateQuote = useCallback((symbol: string, quote: Quote) => {
    dispatch({ type: 'UPDATE_QUOTE', payload: { symbol, quote } })
  }, [])

  const setPositions = useCallback((positions: Position[]) => {
    dispatch({ type: 'SET_POSITIONS', payload: positions })
  }, [])

  const addPosition = useCallback((position: Position) => {
    dispatch({ type: 'ADD_POSITION', payload: position })
  }, [])

  const updatePosition = useCallback((id: string, updates: Partial<Position>) => {
    dispatch({ type: 'UPDATE_POSITION', payload: { id, updates } })
  }, [])

  const closePosition = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_POSITION', payload: id })
  }, [])

  const setPendingOrders = useCallback((orders: Order[]) => {
    dispatch({ type: 'SET_PENDING_ORDERS', payload: orders })
  }, [])

  const submitOrder = useCallback(async (order: OrderFormData) => {
    setIsSubmitting(true)
    try {
      const symbol = state.symbols.find(s => s.symbol === order.symbol)
      const currentQuote = state.quotes[order.symbol]

      if (!symbol) {
        throw new Error('Symbol not found')
      }

      const currentPrice = order.side === 'buy'
        ? (currentQuote?.ask || generateMockQuote(order.symbol).ask)
        : (currentQuote?.bid || generateMockQuote(order.symbol).bid)

      const position: Position = {
        id: uuidv4(),
        accountId: 'demo_account',
        symbol: order.symbol,
        side: order.side === 'buy' ? 'long' : 'short',
        volume: order.volume,
        openPrice: currentPrice,
        currentPrice,
        sl: order.sl,
        tp: order.tp,
        swap: 0,
        commission: order.volume * 3.5,
        profit: 0,
        profitPercent: 0,
        margin: order.volume * 1000,
        marginPercent: 1.5,
        openTime: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      dispatch({ type: 'ADD_POSITION', payload: position })

      const totalProfit = [...state.positions, position].reduce((sum, p) => sum + (p.profit || 0), 0)
      if (state.account) {
        dispatch({
          type: 'SET_ACCOUNT',
          payload: {
            ...state.account,
            equity: state.account.balance + totalProfit,
            profit: totalProfit,
            profitPercent: (totalProfit / state.account.balance) * 100,
          }
        })
      }

      return { success: true, data: { position } }
    } catch (error) {
      console.error('Failed to submit order:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [state.symbols, state.quotes, state.positions, state.account])

  const submitOCOOrder = useCallback(async (order: OCOOrderData) => {
    setIsSubmitting(true)
    try {
      const symbol = state.symbols.find(s => s.symbol === order.symbol)
      if (!symbol) {
        throw new Error('Symbol not found')
      }

      const currentQuote = state.quotes[order.symbol]
      const currentPrice = currentQuote?.ask || generateMockQuote(order.symbol).ask

      const slPrice = order.side === 'buy'
        ? currentPrice - order.sl * symbol.pipSize
        : currentPrice + order.sl * symbol.pipSize

      const tpPrice = order.side === 'buy'
        ? currentPrice + order.tp * symbol.pipSize
        : currentPrice - order.tp * symbol.pipSize

      const position: Position = {
        id: uuidv4(),
        accountId: 'demo_account',
        symbol: order.symbol,
        side: order.side === 'buy' ? 'long' : 'short',
        volume: order.volume,
        openPrice: currentPrice,
        currentPrice,
        sl: slPrice,
        tp: tpPrice,
        swap: 0,
        commission: order.volume * 3.5,
        profit: 0,
        profitPercent: 0,
        margin: order.volume * 1000,
        marginPercent: 1.5,
        openTime: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      dispatch({ type: 'ADD_POSITION', payload: position })

      return { success: true }
    } catch (error) {
      console.error('Failed to submit OCO order:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [state.symbols, state.quotes])

  const cancelOrder = useCallback(async (id: string) => {
    dispatch({ type: 'REMOVE_ORDER', payload: id })
  }, [])

  const modifyPosition = useCallback((id: string, updates: { sl?: number; tp?: number }) => {
    dispatch({ type: 'UPDATE_POSITION', payload: { id, updates } })
  }, [])

  const setAccount = useCallback((account: Account) => {
    dispatch({ type: 'SET_ACCOUNT', payload: account })
  }, [])

  const setInterval = useCallback((interval: ChartInterval) => {
    dispatch({ type: 'SET_INTERVAL', payload: interval })
  }, [])

  const calculateRisk = useCallback((volume: number, sl?: number): RiskCalculation | null => {
    if (!state.currentSymbol || !state.account) return null

    const pipValue = volume * 10 * state.currentSymbol.pipSize
    const marginRequired = volume * 1000

    const maxVolume = state.account.freeMargin / marginRequired
    const riskAmount = sl ? volume * Math.abs(sl) * pipValue : 0
    const riskPercent = state.account.equity > 0 ? (riskAmount / state.account.equity) * 100 : 0

    return {
      marginRequired: volume * marginRequired,
      pipValue,
      suggestedSL: state.currentSymbol.pipSize * 50,
      suggestedTP: state.currentSymbol.pipSize * 100,
      maxVolume: Math.min(maxVolume, state.currentSymbol.maxLot),
      riskAmount,
      riskPercent,
    }
  }, [state.currentSymbol, state.account])

  const loadPositions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/positions`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        dispatch({ type: 'SET_POSITIONS', payload: data.data.positions })
      }
    } catch (error) {
      console.error('Failed to load positions:', error)
    }
  }, [API_URL])

  const loadAccount = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/accounts`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success && data.data.account) {
        dispatch({ type: 'SET_ACCOUNT', payload: data.data.account })
      }
    } catch (error) {
      console.error('Failed to load account:', error)
    }
  }, [API_URL])

  useEffect(() => {
    const allSymbols = [...FOREX_PAIRS, ...CRYPTO_PAIRS, ...INDICES, ...COMMODITIES]
    dispatch({ type: 'SET_SYMBOLS', payload: allSymbols })

    const firstSymbol = allSymbols.find(s => s.symbol === 'EURUSD') || allSymbols[0]
    dispatch({ type: 'SET_CURRENT_SYMBOL', payload: firstSymbol })

    allSymbols.forEach((symbol) => {
      const quote = generateMockQuote(symbol.symbol)
      dispatch({ type: 'UPDATE_QUOTE', payload: { symbol: symbol.symbol, quote } })
    })

    dispatch({ type: 'SET_ACCOUNT', payload: generateMockAccount() })

    dispatch({ type: 'SET_CONNECTED', payload: true })

    const quoteInterval = setInterval(() => {
      allSymbols.forEach((symbol) => {
        const currentQuote = state.quotes[symbol.symbol] || generateMockQuote(symbol.symbol)
        const change = (Math.random() - 0.5) * symbol.pipSize * 2
        const newQuote: Quote = {
          ...currentQuote,
          bid: currentQuote.bid + change,
          ask: currentQuote.ask + change,
          time: new Date().toISOString(),
        }
        dispatch({ type: 'UPDATE_QUOTE', payload: { symbol: symbol.symbol, quote: newQuote } })

        dispatch({
          type: 'UPDATE_POSITION_PRICE',
          payload: { symbol: symbol.symbol, bid: newQuote.bid, ask: newQuote.ask },
        })
      })
    }, 500)

    return () => {
      clearInterval(quoteInterval)
    }
  }, [])

  const value: TradingContextValue = {
    state,
    selectSymbol,
    setSymbols,
    updateQuote,
    setPositions,
    addPosition,
    updatePosition,
    closePosition,
    setPendingOrders,
    submitOrder,
    submitOCOOrder,
    cancelOrder,
    modifyPosition,
    setAccount,
    setInterval,
    calculateRisk,
    loadPositions,
    loadAccount,
    pendingOrder: isSubmitting,
  }

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  )
}

export function useTrading() {
  const context = useContext(TradingContext)
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider')
  }
  return context
}
