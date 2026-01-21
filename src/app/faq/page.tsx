'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const faqData: Record<string, Array<{ q: string; a: string }>> = {
    general: [
      { q: 'What is a prop firm?', a: 'A proprietary trading firm provides capital to traders to trade in financial markets. Traders don\'t use their own money but split profits with the firm based on agreed terms.' },
      { q: 'How does PropTrade Pro work?', a: 'We evaluate traders through our challenge program. Traders who pass our evaluation criteria receive funded accounts and can keep up to 80% of their profits.' },
      { q: 'Is there any risk to me?', a: 'You risk only the challenge fee you pay. You never risk your personal capital since you trade with our firm\'s capital.' },
    ],
    challenges: [
      { q: 'What happens if I fail the challenge?', a: 'If you fail the challenge, you can purchase another challenge at any time. Many traders succeed on their second or third attempt after learning from their experience.' },
      { q: 'Can I use automated trading systems?', a: 'Yes, EAs and automated trading systems are allowed. However, they must be submitted for verification before use in live trading.' },
      { q: 'How long does the challenge take?', a: 'The Standard challenge has no time limit. The Express challenge must be completed within 14 days. You can finish faster if you hit your targets early.' },
    ],
    funding: [
      { q: 'When do I get paid?', a: 'You can request your first payout 14 days after receiving your funded account. Subsequent payouts can be requested at any time with a 48-hour processing period.' },
      { q: 'What is the profit split?', a: 'We offer an industry-leading 80% profit split to our traders. This means you keep 80% of all profits you generate.' },
      { q: 'How can I scale my account?', a: 'Accounts are evaluated every 4 weeks. If you maintain profitability and follow all rules, your account can be scaled up by 25-50% each evaluation period.' },
    ],
    trading: [
      { q: 'What instruments can I trade?', a: 'We offer trading on Forex, Indices, Commodities, and Cryptocurrencies. Full list of available instruments is provided in your trading platform.' },
      { q: 'Are there trading hour restrictions?', a: 'Trading is available 24/5 during market hours. Some instruments may have specific trading sessions which are documented in our trading rules.' },
      { q: 'Can I trade during news events?', a: 'Yes, trading during high-impact news events is permitted. However, we strongly advise against it due to increased volatility and slippage risk.' },
    ],
    account: [
      { q: 'How do I reset my password?', a: 'Click on \'Forgot Password\' on the login page. You\'ll receive a password reset link at your registered email address.' },
      { q: 'Can I have multiple accounts?', a: 'Yes, you can purchase and manage multiple challenges simultaneously. Each challenge operates independently with its own account balance and targets.' },
      { q: 'How do I contact support?', a: 'Our support team is available 24/7 via live chat, email at support@proptradepro.com, or through our Discord community.' },
    ],
  }

  const categories = [
    { key: 'general', label: 'General' },
    { key: 'challenges', label: 'Challenges' },
    { key: 'funding', label: 'Funding & Payouts' },
    { key: 'trading', label: 'Trading Rules' },
    { key: 'account', label: 'Account Management' },
  ]

  const toggleItem = (index: string) => {
    setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const filteredFAQs = faqData[activeCategory]?.filter(
    (item) => item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PropTrade Pro</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary-600">Home</Link>
            <Link href="/challenges" className="text-sm font-medium text-gray-600 hover:text-primary-600">Challenges</Link>
            <Link href="/rules" className="text-sm font-medium text-gray-600 hover:text-primary-600">Rules</Link>
            <Link href="/faq" className="text-sm font-medium text-primary-600">FAQ</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Log In</Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">Sign Up</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Frequently Asked Questions</h1>
              <p className="text-base text-gray-600">Find answers to common questions about our funded trading program</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => toggleItem(`${activeCategory}-${index}`)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900">{item.q}</span>
                      {openItems[`${activeCategory}-${index}`] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openItems[`${activeCategory}-${index}`] && (
                      <div className="px-4 pb-4">
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600">{item.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No questions found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Our support team is available 24/7 to help you with any questions.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:support@protradepro.com" className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">Contact Support</a>
              <a href="#" className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">Join Discord</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm text-gray-400 text-center">© 2024 PropTrade Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
