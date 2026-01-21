import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

import { config } from './config'
import routes from './routes'
import { errorHandler, notFound } from './middleware/error'
import { initializeDatabase, db } from './db/sqlite'

initializeDatabase()

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'))
}

// Compression
app.use(compression())

// API routes
app.use('/api', routes)

// Health check
app.get('/health', (_req, res) => {
  try {
    db.prepare('SELECT 1').get()
    res.json({ status: 'healthy', database: 'connected' })
  } catch {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' })
  }
})

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`)
  console.log(`📝 Environment: ${config.env}`)
  console.log(`🔗 API URL: ${config.apiUrl}`)
  console.log(`💾 Database: SQLite (data.db)`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  db.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  db.close()
  process.exit(0)
})

export default app
