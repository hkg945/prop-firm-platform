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
    default: 'EdgeFlow Capital - Trade Our Capital, Keep Your Profits',
    template: '%s | EdgeFlow Capital',
  },
  description: 'Prove your trading skills and get funded with up to $200,000 in capital. No personal risk, 80% profit split, instant payouts.',
  keywords: ['prop firm', 'funded trading', 'forex trading', 'capital funding', 'trading challenge'],
  authors: [{ name: 'EdgeFlow Capital' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'EdgeFlow Capital',
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
