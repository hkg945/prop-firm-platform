'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react'
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
  generateMockPosition,
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

interface OCOOrderData {
  symbol: string
  side: 'buy' | 'sell'
  volume: number
  sl: number
  tp: number
  comment?: string
  timeInForce?: string
}

const TradingContext = createContext<TradingContextValue | null>(null)

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState)
  const wsRef = useRef<WebSocket | null>(null)

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

  const closePosition = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/trades/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionId: id }),
      })
      if (response.ok) {
        dispatch({ type: 'REMOVE_ORDER', payload: id })
      }
    } catch (error) {
      console.error('Failed to close position:', error)
    }
  }, [API_URL])

  const setPendingOrders = useCallback((orders: Order[]) => {
    dispatch({ type: 'SET_PENDING_ORDERS', payload: orders })
  }, [])

  const submitOrder = useCallback(async (order: OrderFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      const data = await response.json()
      if (data.success) {
        dispatch({ type: 'ADD_PENDING_ORDER', payload: data.data.order })
        if (data.data.position) {
          dispatch({ type: 'ADD_POSITION', payload: data.data.position })
        }
      }
      return data
    } catch (error) {
      console.error('Failed to submit order:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [API_URL])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitOCOOrder = useCallback(async (order: OCOOrderData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${API_URL}/oco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      const data = await response.json()
      if (data.success) {
        await loadPendingOrders()
      }
      return data
    } catch (error) {
      console.error('Failed to submit OCO order:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [API_URL])

  const loadPendingOrders = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        dispatch({ type: 'SET_PENDING_ORDERS', payload: data.data.orders })
      }
    } catch (error) {
      console.error('Failed to load pending orders:', error)
    }
  }, [API_URL])

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

  const cancelOrder = useCallback(async (id: string) => {
    try {
      await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' })
      dispatch({ type: 'REMOVE_ORDER', payload: id })
    } catch (error) {
      console.error('Failed to cancel order:', error)
    }
  }, [API_URL])

  const modifyPosition = useCallback(async (id: string, updates: { sl?: number; tp?: number }) => {
    try {
      const response = await fetch(`${API_URL}/positions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        dispatch({ type: 'UPDATE_POSITION', payload: { id, updates } })
      }
    } catch (error) {
      console.error('Failed to modify position:', error)
    }
  }, [API_URL])

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

  useEffect(() => {
    const allSymbols = [...FOREX_PAIRS, ...CRYPTO_PAIRS, ...INDICES, ...COMMODITIES]
    dispatch({ type: 'SET_SYMBOLS', payload: allSymbols })

    const firstSymbol = allSymbols[0]
    dispatch({ type: 'SET_CURRENT_SYMBOL', payload: firstSymbol })

    const initialQuotes: Record<string, Quote> = {}
    allSymbols.forEach((symbol) => {
      initialQuotes[symbol.symbol] = generateMockQuote(symbol.symbol)
    })
    allSymbols.forEach((symbol) => {
      dispatch({ type: 'UPDATE_QUOTE', payload: { symbol: symbol.symbol, quote: initialQuotes[symbol.symbol] } })
    })

    const mockPositions = [
      generateMockPosition('EURUSD', 'long'),
      generateMockPosition('GBPUSD', 'short'),
      generateMockPosition('XAUUSD', 'long'),
    ]
    dispatch({ type: 'SET_POSITIONS', payload: mockPositions })

    dispatch({ type: 'SET_ACCOUNT', payload: generateMockAccount() })

    dispatch({ type: 'SET_CONNECTED', payload: true })

    const quoteInterval = setInterval(() => {
      allSymbols.forEach((symbol) => {
        const currentQuote = state.quotes[symbol.symbol] || generateMockQuote(symbol.symbol)
        const newQuote: Quote = {
          ...currentQuote,
          bid: currentQuote.bid + (Math.random() - 0.5) * symbol.pipSize * 10,
          ask: currentQuote.ask + (Math.random() - 0.5) * symbol.pipSize * 10,
          time: new Date().toISOString(),
        }
        dispatch({ type: 'UPDATE_QUOTE', payload: { symbol: symbol.symbol, quote: newQuote } })
      })

      dispatch({ type: 'UPDATE_ACCOUNT', payload: {
        equity: 100000 + (Math.random() - 0.5) * 1000,
        profit: (Math.random() - 0.3) * 500,
      } })
    }, 1000)

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
