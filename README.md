# PropTrade Pro - Professional Trading Terminal

A full-featured web-based trading terminal with TradingView integration, real-time position tracking, and comprehensive order management for Prop Firm trading.

## Features

### 🎯 **Professional Trading Terminal**
- **TradingView Chart Integration** - Full-featured charts with technical indicators
- **Real-time Position Tracking** - Live P/L updates with price movements
- **Advanced Order Types** - Market, Limit, Stop, OCO orders
- **Multi-asset Support** - Forex, Crypto, Indices, Commodities
- **Risk Management** - Stop Loss, Take Profit, margin calculations

### 🌐 **Official Website**
- **Marketing Pages** - Brand introduction and CTAs
- **Challenge Plans** - Multiple pricing tiers with feature comparison
- **Trading Rules** - Comprehensive risk management guidelines
- **FAQ** - Multi-category frequently asked questions
- **Multi-language Support** - English, Simplified Chinese, Traditional Chinese

### 🛠 **Technical Features**
- **SEO Optimized** - Server-side rendering and meta tags
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - WebSocket for live data
- **Secure Authentication** - JWT-based user management
- **Data Persistence** - SQLite database for trading records

## Tech Stack

### Frontend
- **Framework**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Charts**: TradingView Widget
- **State Management**: React Context + useReducer
- **Real-time**: WebSocket client

### Backend
- **Framework**: Express.js, TypeScript
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT + bcrypt
- **Real-time**: WebSocket server
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate limiting

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Railway (free tier available)
- **Database**: SQLite (file-based, no external DB needed)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prop-firm-platform.git

# Navigate to project directory
cd prop-firm-platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Setup environment variables (copy and modify)
cp .env.local.example .env.local  # Frontend
cp backend/.env.example backend/.env  # Backend
```

### Development

```bash
# Terminal 1 - Start Frontend (http://localhost:3001)
npm run dev

# Terminal 2 - Start Backend (http://localhost:3003)
cd backend
npm run dev

# Terminal 3 - WebSocket Server (http://localhost:3004)
# Automatically started with backend
```

### Production Build

```bash
# Build frontend
npm run build
npm start

# Build backend
cd backend
npm run build
npm start
```

### Docker Deployment

```bash
# Build and run with Docker
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## Project Structure

```
prop-firm-platform/
├── src/                    # Frontend (Next.js)
│   ├── app/
│   │   ├── home/           # Marketing homepage
│   │   ├── challenges/     # Challenge plans
│   │   ├── rules/          # Trading rules
│   │   ├── faq/            # FAQ section
│   │   ├── login/          # Authentication
│   │   ├── signup/         # User registration
│   │   ├── dashboard/      # User dashboard
│   │   ├── terminal/       # 🆕 Trading Terminal
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home redirect
│   ├── components/
│   │   ├── ui/             # Base UI components
│   │   ├── trading/        # 🆕 Trading components
│   │   │   ├── OrderEntry.tsx
│   │   │   ├── PositionsPanel.tsx
│   │   │   ├── Watchlist.tsx
│   │   │   └── TradingViewChart.tsx
│   │   ├── layout/         # Layout components
│   │   └── dashboard/      # Dashboard components
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── TradingContext.tsx  # 🆕 Trading state
│   ├── data/
│   │   └── mockTradingData.ts  # 🆕 Trading data
│   ├── services/           # API services
│   ├── types/
│   │   ├── index.ts
│   │   └── trading.ts      # 🆕 Trading types
│   └── lib/                # Utilities
├── backend/                # 🆕 Backend (Express.js)
│   ├── src/
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts     # Authentication
│   │   │   ├── orders.ts   # Order management
│   │   │   ├── positions.ts # Position tracking
│   │   │   └── index.ts    # Route aggregation
│   │   ├── db/             # Database layer
│   │   │   ├── sqlite.ts   # SQLite operations
│   │   └── websocket.ts    # WebSocket server
│   ├── data.db             # SQLite database
│   └── package.json
├── public/                 # Static assets
├── README.md               # This file
├── package.json            # Frontend dependencies
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind config
└── vercel.json             # Vercel deployment
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PropTrade Pro
NEXT_PUBLIC_GA_ID=       # Optional Google Analytics
NEXT_PUBLIC_GTM_ID=      # Optional Google Tag Manager
```

## Deployment

### 🚀 **Free Online Demo** (Recommended)

#### 1. Frontend - Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy frontend
vercel --prod

# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app/api/v1
NEXT_PUBLIC_APP_NAME=PropTrade Pro
```

#### 2. Backend - Railway (Free)
```bash
# 1. Go to https://railway.app
# 2. Connect your GitHub repository
# 3. Railway will auto-detect Node.js app
# 4. Set environment variables in Railway dashboard:

NODE_ENV=production
PORT=3003
API_URL=https://your-app-name.up.railway.app/api/v1
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend-url.vercel.app

# 5. Deploy automatically on git push
```

### 🐳 **Docker Deployment**

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

### 📋 **Environment Variables**

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3003/api/v1
NEXT_PUBLIC_APP_NAME=PropTrade Pro
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=3003
API_URL=https://your-backend-url/api/v1
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url
```

## API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/refresh` - Refresh access token

### Trading Endpoints
- `POST /api/v1/orders` - Place new order
- `GET /api/v1/orders` - Get pending orders
- `DELETE /api/v1/orders/:id` - Cancel order
- `GET /api/v1/positions` - Get open positions
- `PATCH /api/v1/positions/:id` - Modify position (SL/TP)
- `POST /api/v1/positions/:id/close` - Close position
- `POST /api/v1/positions/close-all` - Close all positions
- `GET /api/v1/positions/trades/history` - Trade history
- `GET /api/v1/positions/trades/stats` - Trading statistics

### Advanced Orders
- `POST /api/v1/oco` - Place One Cancels Other (OCO) order
- `POST /api/v1/ocooco` - Place OCOOCO order
- `GET /api/v1/oco-groups` - Get OCO groups

### WebSocket (ws://localhost:3004)
- **Quotes**: Subscribe to real-time price updates
- **Positions**: Live position updates
- **Orders**: Order status changes

## Internationalization

The platform supports the following languages:
- English (en) - Default
- Simplified Chinese (zh)
- Traditional Chinese (tw)

To add a new language:
1. Create a new JSON file in `src/i18n/locales/`
2. Add the locale to `src/i18n/config.ts`
3. Update `locales` array in configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Disclaimer

Trading involves substantial risk of loss. Past performance does not guarantee future results. This platform is for educational and demonstration purposes.
