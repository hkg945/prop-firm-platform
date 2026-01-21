# PropTrade Pro - Backend API

Backend API server for the PropTrade Pro platform.

## Quick Start

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
```

## Database Setup

1. Create a PostgreSQL database named `proptradepro`
2. Run the schema:
   ```bash
   psql -U postgres -d proptradepro -f schema.sql
   ```
3. Copy `.env.example` to `.env` and configure your settings

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration
│   ├── controllers/    # Request handlers
│   ├── db/             # Database connection
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   └── types/          # TypeScript types
├── schema.sql          # Database schema
├── API_DOCUMENTATION.md # API docs
└── package.json
```

## API Base URL

```
Development: http://localhost:3001
```

See `API_DOCUMENTATION.md` for full API documentation.
