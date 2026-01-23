# EdgeFlow Capital API Documentation

## Base URL

```
Development: http://localhost:3001
Production:  https://api.edgeflowcapital.com
```

## Authentication

All API endpoints require authentication via JWT token.

```http
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "trader@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Trader",
  "phone": "+1234567890",
  "country": "United States",
  "timezone": "America/New_York"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "trader@example.com",
      "firstName": "John",
      "lastName": "Trader",
      "status": "active"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "trader@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "trader@example.com",
      "firstName": "John",
      "lastName": "Trader",
      "status": "active"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Profile

```http
GET /api/v1/auth/profile
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "trader@example.com",
    "firstName": "John",
    "lastName": "Trader",
    "phone": "+1234567890",
    "country": "United States",
    "timezone": "America/New_York",
    "avatarUrl": "https://...",
    "status": "active",
    "emailVerified": true,
    "twoFactorEnabled": false,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

## Accounts Endpoints

### List Accounts

```http
GET /api/v1/accounts
Authorization: Bearer <access_token>

Query Parameters:
- page (number, default: 1)
- pageSize (number, default: 10)
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "acc_001",
        "accountNumber": "EF-2024-001234",
        "type": "standard",
        "phase": "challenge_1",
        "status": "active",
        "startingBalance": 25000,
        "balance": 25250,
        "equity": 25250,
        "profit": 250,
        "profitTarget": 2000,
        "profitPercentage": 1.0,
        "maxDrawdown": 10,
        "dailyDrawdown": 5,
        "currentDrawdown": 1.0,
        "maxDrawdownUsed": 1.0,
        "dailyDrawdownUsed": 1.0,
        "challengeStartedAt": "2024-01-15T10:00:00Z",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

### Get Account Details

```http
GET /api/v1/accounts/:id
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "acc_001",
    "accountNumber": "EF-2024-001234",
    "type": "standard",
    "phase": "challenge_1",
    "status": "active",
    "startingBalance": 25000,
    "balance": 25250,
    "equity": 25250,
    "margin": 250,
    "freeMargin": 25000,
    "profit": 250,
    "profitTarget": 2000,
    "profitPercentage": 1.0,
    "maxDrawdown": 10,
    "dailyDrawdown": 5,
    "currentDrawdown": 1.0,
    "maxDrawdownUsed": 1.0,
    "dailyDrawdownUsed": 1.0,
    "challengeStartedAt": "2024-01-15T10:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

### Get Account Stats

```http
GET /api/v1/accounts/stats
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "activeAccounts": 3,
    "totalAccounts": 5,
    "totalProfit": 4850.50,
    "winningTradesCount": 31,
    "totalClosedTrades": 47
  }
}
```

---

## Trades Endpoints

### List Trades

```http
GET /api/v1/trades
Authorization: Bearer <access_token>

Query Parameters:
- accountId (string, optional)
- symbol (string, optional)
- status (open | closed)
- startDate (ISO date, optional)
- endDate (ISO date, optional)
- page (number, default: 1)
- pageSize (number, default: 20)
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "trd_001",
        "accountId": "acc_001",
        "accountNumber": "EF-2024-001234",
        "symbol": "EURUSD",
        "direction": "buy",
        "volume": 1.0,
        "entryPrice": 1.0850,
        "exitPrice": 1.0925,
        "entryTime": "2024-01-20T08:30:00Z",
        "exitTime": "2024-01-20T14:45:00Z",
        "pnl": 750.00,
        "pnlPercentage": 3.0,
        "swap": 0,
        "commission": -7,
        "durationMinutes": 375,
        "status": "closed",
        "tpLevel": 1.0950,
        "slLevel": 1.0800
      }
    ],
    "total": 47,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

### Get Trade Statistics

```http
GET /api/v1/trades/stats
Authorization: Bearer <access_token>

Query Parameters:
- accountId (string, optional)
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "totalTrades": 47,
    "winningTrades": 31,
    "losingTrades": 16,
    "winRate": 65.96,
    "averageWin": 485.50,
    "averageLoss": -285.30,
    "profitFactor": 3.32,
    "totalPnL": 8500.75,
    "averagePnLPercentage": 2.5,
    "averageDuration": 195,
    "maxDuration": 510,
    "minDuration": 45
  }
}
```

---

## Challenge Rules Endpoints

### List All Rules

```http
GET /api/v1/rules
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "rule_001",
      "type": "standard",
      "name": "Standard Challenge",
      "description": "Our most popular challenge with balanced requirements",
      "accountSize": 25000,
      "price": 99,
      "profitTarget": 8,
      "maxDrawdown": 10,
      "dailyDrawdown": 5,
      "minTradingDays": 5,
      "durationDays": 30,
      "isActive": true
    },
    {
      "id": "rule_002",
      "type": "express",
      "name": "Express Challenge",
      "description": "Fast-tracked evaluation for experienced traders",
      "accountSize": 25000,
      "price": 149,
      "profitTarget": 8,
      "maxDrawdown": 10,
      "dailyDrawdown": 5,
      "minTradingDays": 3,
      "durationDays": 14,
      "isActive": true
    },
    {
      "id": "rule_003",
      "type": "scaling",
      "name": "Scaling Challenge",
      "description": "For larger capital",
      "accountSize": traders ready to manage 100000,
      "price": 399,
      "profitTarget": 10,
      "maxDrawdown": 10,
      "dailyDrawdown": 5,
      "minTradingDays": 10,
      "durationDays": 60,
      "isActive": true
    }
  ]
}
```

### Get Rule by Type

```http
GET /api/v1/rules/:type
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "rule_001",
    "type": "standard",
    "name": "Standard Challenge",
    "description": "Our most popular challenge with balanced requirements",
    "accountSize": 25000,
    "price": 99,
    "profitTarget": 8,
    "maxDrawdown": 10,
    "dailyDrawdown": 5,
    "minTradingDays": 5,
    "durationDays": 30,
    "isActive": true
  }
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authentication Error (401)

```json
{
  "success": false,
  "error": "Authentication required"
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": "Account not found"
}
```

### Rate Limit (429)

```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limits

| Endpoint | Requests | Window |
|----------|----------|--------|
| API (general) | 100 | 15 minutes |
| Auth (login/register) | 10 | 15 minutes |

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limited |
| 500 | Server Error |
