import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { config } from '../config'
import { createUser, getUserByEmail, getUserById, updateLastLogin } from '../db/sqlite'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
})

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = getUserByEmail(data.email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role || 'user', type: 'access' },
      config.jwt.secret as jwt.Secret,
      { expiresIn: config.jwt.accessExpiry } as any
    )

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwt.secret as jwt.Secret,
      { expiresIn: config.jwt.refreshExpiry } as any
    )

    updateLastLogin(user.id)

    const { password_hash, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      })
    }
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed',
    })
  }
})

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    const existingUser = getUserByEmail(data.email)
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      })
    }

    const passwordHash = await bcrypt.hash(data.password, 12)
    const userId = uuidv4()

    const newUser = createUser({
      id: userId,
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      country: data.country,
      timezone: data.timezone,
    })

    if (!newUser) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create user',
      })
    }

    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role || 'user', type: 'access' },
      config.jwt.secret as string,
      { expiresIn: config.jwt.accessExpiry as any }
    )

    const refreshToken = jwt.sign(
      { userId: newUser.id, type: 'refresh' },
      config.jwt.secret as string,
      { expiresIn: config.jwt.refreshExpiry as any }
    )

    const { password_hash, ...userWithoutPassword } = newUser

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      })
    }
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required',
      })
    }

    const decoded = jwt.verify(refreshToken, config.jwt.secret) as { userId: string; type: string }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
      })
    }

    const user = getUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      })
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role || 'user', type: 'access' },
      config.jwt.secret as string,
      { expiresIn: config.jwt.accessExpiry as any }
    )

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token expired',
      })
    }
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    })
  }
})

router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string }

    const user = getUserById(decoded.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      })
    }

    const { password_hash, ...userWithoutPassword } = user
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    })
  }
})

export default router
