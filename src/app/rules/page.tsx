import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, AlertTriangle, TrendingUp, Clock, Target, PercentCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Trading Rules - PropTrade Pro',
  description: 'Understand our trading rules and risk management guidelines. Clear, transparent rules for all traders.',
}

export default function RulesPage() {
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
            <Link href="/rules" className="text-sm font-medium text-primary-600">Rules</Link>
            <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-primary-600">FAQ</Link>
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Trading Rules</h1>
              <p className="text-base text-gray-600">Understanding our rules is key to your success</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Risk Management</h2>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Maximum Drawdown', desc: 'Your account cannot exceed a 10% maximum drawdown from the initial balance. Once reached, the account is breached.', rule: '10% Max Drawdown' },
                  { title: 'Daily Drawdown', desc: 'Daily losses are limited to 5% of the account balance. This resets at 5 PM EST daily.', rule: '5% Daily Limit' },
                  { title: 'Position Limits', desc: 'Maximum 5% of account equity per position. Maximum 20% exposure across all positions.', rule: '5% per Position' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">{item.rule}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Trading Rules</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Target, title: 'Profit Target', desc: 'Achieve the specified profit target within the challenge period to qualify for funding.' },
                  { icon: Clock, title: 'Trading Days', desc: 'Minimum trading days required. Day count includes any day with a trade executed.' },
                  { icon: PercentCircle, title: 'EA & Automation', desc: 'Expert Advisors and automated trading are allowed but must be verified before use.' },
                  { icon: AlertTriangle, title: 'News Trading', desc: 'Trading during high-impact news events is permitted but discouraged for risk management.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Funded Account Rules</h2>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Phase 2 Trading', desc: 'Continue following all rules while building your track record during the verification phase.' },
                  { title: 'Payouts', desc: 'Request payouts at any time after the first 14 days. 80% profit split applies.' },
                  { title: 'Scaling', desc: 'Accounts can be scaled up every 4 weeks based on consistent profitability.' },
                ].map((item) => (
                  <div key={item.title} className="bg-green-50/50 rounded-xl border border-green-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Our support team is available 24/7 to help you understand any of our rules.</p>
            <Link href="/faq" className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700">View FAQ</Link>
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
