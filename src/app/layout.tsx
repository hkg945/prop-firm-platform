import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'PropTrade Pro - Trade Our Capital, Keep Your Profits',
    template: '%s | PropTrade Pro',
  },
  description: 'Prove your trading skills and get funded with up to $200,000 in capital. No personal risk, 80% profit split, instant payouts.',
  keywords: ['prop firm', 'funded trading', 'forex trading', 'capital funding', 'trading challenge'],
  authors: [{ name: 'PropTrade Pro' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PropTrade Pro',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
