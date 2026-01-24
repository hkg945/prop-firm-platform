import { Metadata } from 'next'
import Link from 'next/link'
import { Check, Shield, TrendingUp, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Trading Challenges - EdgeFlow Capital',
  description: 'Choose from our variety of funded trading challenges. Get funded up to $200,000 with EdgeFlow Capital.',
}

export default function ChallengesPage() {
  const challenges = [
    { id: 'starter', name: 'Starter', price: 99, accountSize: 10000, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, minTradingDays: 5, duration: 'Unlimited', features: ['80% Profit Split', '24/5 Support', 'WebTrader', '1:100 Leverage'], popular: false },
    { id: 'standard', name: 'Standard', price: 399, accountSize: 50000, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, minTradingDays: 5, duration: 'Unlimited', features: ['80% Profit Split', '24/5 Support', 'WebTrader', '1:100 Leverage', 'News Trading Allowed'], popular: false },
    { id: 'professional', name: 'Professional', price: 599, accountSize: 100000, profitTarget: 8, maxDrawdown: 10, dailyDrawdown: 5, minTradingDays: 5, duration: 'Unlimited', features: ['80% Profit Split', '24/5 Priority Support', 'WebTrader', '1:100 Leverage', 'News Trading Allowed'], popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 1199, accountSize: 200000, profitTarget: 6, maxDrawdown: 10, dailyDrawdown: 5, minTradingDays: 10, duration: 'Unlimited', features: ['80% Profit Split', '24/7 Priority Support', 'WebTrader', '1:100 Leverage', 'News Trading Allowed', 'Dedicated Manager'], popular: false },
  ]

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EdgeFlow Capital</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary-600">Home</Link>
            <Link href="/challenges" className="text-sm font-medium text-primary-600">Challenges</Link>
            <Link href="/rules" className="text-sm font-medium text-gray-600 hover:text-primary-600">Rules</Link>
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Trading Challenges</h1>
              <p className="text-base text-gray-600">Choose the challenge that matches your skills and goals</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className={`relative bg-white rounded-xl border-2 ${challenge.popular ? 'border-primary-500' : 'border-gray-200'} p-6`}>
                  {challenge.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">Most Popular</span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{challenge.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">${challenge.price}</span>
                      <span className="text-gray-500">/one-time</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{formatCurrency(challenge.accountSize)} Account</p>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Profit Target</span>
                      <span className="font-semibold text-gray-900">{challenge.profitTarget}%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Max Drawdown</span>
                      <span className="font-semibold text-gray-900">{challenge.maxDrawdown}%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Daily Drawdown</span>
                      <span className="font-semibold text-gray-900">{challenge.dailyDrawdown}%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Min Trading Days</span>
                      <span className="font-semibold text-gray-900">{challenge.minTradingDays}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="font-semibold text-gray-900">{challenge.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {challenge.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/checkout/${challenge.id}`} className="block">
                    <button className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all ${challenge.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                      Start Challenge
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">Why Choose Our Challenges?</h2>
              <p className="text-base text-gray-600">Our challenges are designed to simulate real trading conditions while giving you a clear path to funded capital.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: 'No Hidden Rules', description: 'Clear, transparent rules. No gray areas, no surprises.' },
                { icon: TrendingUp, title: 'Real Market Conditions', description: 'Trade with real spreads and execution. No simulated pricing.' },
                { icon: Calendar, title: 'Flexible Timeline', description: 'Take your time to prove your skills. No rush, no pressure.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">EF</span>
                  </div>
                <span className="text-xl font-bold text-white">EdgeFlow Capital</span>
              </Link>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-sm hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/challenges" className="text-sm hover:text-white transition-colors">Challenges</Link></li>
                <li><Link href="/rules" className="text-sm hover:text-white transition-colors">Rules</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">© 2024 EdgeFlow Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
