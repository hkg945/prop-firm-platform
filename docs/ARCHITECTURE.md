# Prop Firm Platform - System Architecture

## Overview

PropTrade Pro is a proprietary trading firm platform that provides funded trading accounts to qualified traders. The platform includes an official marketing website, user dashboard, and admin panel.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Website   │  │  Dashboard  │  │ Admin Panel │              │
│  │   (Public)  │  │   (User)    │  │   (Admin)   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / Load Balancer                   │
│                    (Nginx / Cloudflare)                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Backend API   │ │   WebSocket     │ │    CDN /        │
│   (Node.js)     │ │   Server        │ │    Static       │
│                 │ │                 │ │    Assets       │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │     Redis       │ │    S3 Storage   │
│   (Primary)     │ │   (Cache)       │ │  (Documents)    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Component Details

### Frontend (Next.js + TypeScript)

#### Website Pages
- **Home**: Brand introduction, features, CTA
- **Challenges**: Pricing plans, feature comparison
- **Rules**: Trading rules, risk management guidelines
- **FAQ**: Multi-category support documentation

#### Dashboard Pages
- Account overview and status
- Performance metrics (P&L, drawdown)
- Trading history and statistics
- Challenge progress tracking
- Payout management

#### Admin Panel
- User management
- Account monitoring
- Challenge configuration
- Analytics and reporting

### Backend (Node.js + Express/NestJS)

#### Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Session management
- Two-factor authentication (optional)

#### API Endpoints

**Authentication**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

**Users**
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/accounts`

**Challenges**
- `GET /api/challenges`
- `POST /api/challenges/purchase`
- `GET /api/challenges/:id/progress`

**Trading**
- `GET /api/trading/history`
- `GET /api/trading/statistics`
- `POST /api/trading/demo-sync`

**Admin**
- `GET /api/admin/users`
- `PUT /api/admin/accounts/:id`
- `GET /api/admin/analytics`

### Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'trader',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  equity DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  challenge_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trades
CREATE TABLE trades (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES accounts(id),
  symbol VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  volume DECIMAL(15,5),
  entry_price DECIMAL(15,5),
  exit_price DECIMAL(15,5),
  pnl DECIMAL(15,2),
  status VARCHAR(50),
  opened_at TIMESTAMP,
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  start_balance DECIMAL(15,2),
  current_balance DECIMAL(15,2),
  profit_target DECIMAL(15,2),
  max_drawdown DECIMAL(5,2),
  daily_drawdown DECIMAL(5,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  account_id UUID REFERENCES accounts(id),
  amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Deployment Architecture

#### Development
```
Local Development:
- Next.js dev server (localhost:3000)
- PostgreSQL (Docker)
- Redis (Docker)
```

#### Production (Docker)

```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=proptradepro
      - POSTGRES_USER=...
      - POSTGRES_PASSWORD=...

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

#### Cloud Deployment (AWS/Vercel)

**Frontend**: Vercel / AWS CloudFront + S3
**Backend**: AWS ECS / EC2 / Lambda
**Database**: AWS RDS (PostgreSQL)
**Cache**: AWS ElastiCache (Redis)
**Storage**: AWS S3

## Security Considerations

### Authentication & Authorization
- JWT with short expiration (15 min)
- Refresh token rotation
- Role-based access control
- API rate limiting

### Data Protection
- TLS 1.3 encryption in transit
- AES-256 encryption at rest
- Sensitive data masking
- Regular backups with retention policy

### Infrastructure Security
- WAF (Web Application Firewall)
- DDoS protection
- Security headers (CSP, HSTS, etc.)
- Regular security audits

### Compliance
- GDPR compliance for EU users
- Data residency options
- Audit logging
- Incident response plan

## Monitoring & Logging

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Business metrics

### Infrastructure Monitoring
- Server health checks
- Database performance
- API response times
- Resource utilization

### Logging
- Centralized logging (ELK stack)
- Log retention policy
- Alerting rules
- Access logs

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Load balancer configuration
- Database read replicas
- Cache warming

### Performance Optimization
- Static page generation (SSG)
- API response caching
- Image optimization
- Code splitting

### CDN Strategy
- Static asset caching
- Geographic distribution
- Edge computing support
