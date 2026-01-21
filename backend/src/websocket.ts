import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { getAllSymbols, getOpenPositions, getAccountByUserId, getSymbolBySymbol } from './db/sqlite'

interface Client {
  id: string
  ws: WebSocket
  userId?: string
  subscriptions: Set<string>
}

const clients = new Map<string, Client>()

const quotes = new Map<string, { bid: number; ask: number; time: string }>()

function initializeQuotes() {
  const symbols = getAllSymbols()
  symbols.forEach((symbol: any) => {
    const basePrice = symbol.pip_size * 10000
    quotes.set(symbol.symbol, {
      bid: basePrice - symbol.pip_size,
      ask: basePrice + symbol.pip_size,
      time: new Date().toISOString(),
    })
  })
}

function broadcast(channel: string, message: any) {
  const data = JSON.stringify(message)
  clients.forEach((client) => {
    if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data)
    }
  })
}

function broadcastToUser(userId: string, message: any) {
  const data = JSON.stringify(message)
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data)
    }
  })
}

function updateQuotes() {
  quotes.forEach((quote, symbol) => {
    const symbolInfo = getSymbolBySymbol(symbol)
    if (!symbolInfo) return

    const change = (Math.random() - 0.5) * symbolInfo.pip_size * 2
    quote.bid = Math.max(quote.bid + change, symbolInfo.pip_size)
    quote.ask = quote.bid + symbolInfo.pip_size * 2
    quote.time = new Date().toISOString()
  })
}

function startQuoteUpdates() {
  setInterval(() => {
    updateQuotes()

    quotes.forEach((quote, symbol) => {
      broadcast('quotes', {
        type: 'quote',
        symbol,
        quote: {
          symbol,
          ...quote,
          change: (quote.bid - quote.ask) / quote.ask * 100,
          changePercent: 0,
          high: quote.ask * 1.002,
          low: quote.ask * 0.998,
          volume: Math.floor(Math.random() * 1000000),
        },
      })
    })
  }, 1000)
}

export function createWebSocketServer(port: number = 3004) {
  const wss = new WebSocketServer({ port })

  console.log(`🔌 WebSocket server running on port ${port}`)

  initializeQuotes()

  startQuoteUpdates()

  wss.on('connection', (ws) => {
    const clientId = uuidv4()
    const client: Client = {
      id: clientId,
      ws,
      subscriptions: new Set(['quotes']),
    }
    clients.set(clientId, client)

    console.log(`Client connected: ${clientId}`)

    ws.send(JSON.stringify({
      type: 'connected',
      clientId,
      timestamp: new Date().toISOString(),
    }))

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString())

        switch (message.type) {
          case 'subscribe':
            if (message.channels) {
              message.channels.forEach((channel: string) => {
                client.subscriptions.add(channel)
              })
            }
            break

          case 'unsubscribe':
            if (message.channels) {
              message.channels.forEach((channel: string) => {
                client.subscriptions.delete(channel)
              })
            }
            break

          case 'auth':
            if (message.userId) {
              client.userId = message.userId
            }
            break

          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }))
            break
        }
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    })

    ws.on('close', () => {
      clients.delete(clientId)
      console.log(`Client disconnected: ${clientId}`)
    })

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error)
      clients.delete(clientId)
    })
  })

  return wss
}

export function broadcastPositionUpdate(userId: string, position: any) {
  broadcastToUser(userId, {
    type: 'position_update',
    position,
  })
}

export function broadcastOrderUpdate(userId: string, order: any) {
  broadcastToUser(userId, {
    type: 'order_update',
    order,
  })
}

export function broadcastAccountUpdate(userId: string, account: any) {
  broadcastToUser(userId, {
    type: 'account_update',
    account,
  })
}

export function broadcastTrade(userId: string, trade: any) {
  broadcastToUser(userId, {
    type: 'trade',
    trade,
  })
}

export function sendQuoteUpdate(symbol: string, quote: any) {
  broadcast('quotes', {
    type: 'quote',
    symbol,
    quote,
  })
}

if (require.main === module) {
  createWebSocketServer()
}

export { clients, quotes }
