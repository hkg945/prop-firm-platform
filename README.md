# PropTrade Pro - Prop Firm Platform

A modern, full-featured Prop Firm platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Official Website**: Marketing pages with brand introduction and CTAs
- **Challenge Plans**: Multiple pricing tiers with feature comparison
- **Trading Rules**: Comprehensive risk management and trading guidelines
- **FAQ**: Multi-category frequently asked questions
- **Multi-language Support**: English, Simplified Chinese, Traditional Chinese
- **SEO Optimized**: Server-side rendering and meta tags
- **Responsive Design**: Mobile-first approach
- **Docker Ready**: Production-ready Docker configuration

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Internationalization**: Built-in i18n support
- **Deployment**: Docker, Vercel, or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd prop-firm-platform

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
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
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── home/           # Homepage
│   │   ├── challenges/     # Challenge plans page
│   │   ├── rules/          # Trading rules page
│   │   ├── faq/            # FAQ page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page (redirects to /home)
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   └── layout/         # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Layout.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles
│   └── i18n/               # Internationalization
│       ├── config.ts
│       └── locales/        # Translation files
│           ├── en.json
│           ├── zh.json
│           └── tw.json
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── Dockerfile              # Docker configuration
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

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```bash
docker build -t proptradepro .
docker run -p 3000:3000 proptradepro
```

### Docker Compose

```bash
docker-compose up -d
```

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
