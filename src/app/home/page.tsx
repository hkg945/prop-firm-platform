import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, Zap, DollarSign, Shield, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EdgeFlow Capital - Trade Our Capital, Keep Your Profits',
  description: 'Prove your trading skills and get funded with up to $200,000 in capital. No personal risk, 80% profit split.',
}

export default function HomePage() {
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
            <Link href="/" className="text-sm font-medium text-primary-600">Home</Link>
            <Link href="/challenges" className="text-sm font-medium text-gray-600 hover:text-primary-600">Challenges</Link>
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
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Industry Leading 80% Profit Split</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Trade Our Capital. Keep Your Profits.
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Prove your skills in our funded trading program and access capital up to $200,000 with no personal risk.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/challenges" className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 hover:shadow-md">
                Start Your Challenge
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/rules" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                How It Works
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-sm text-gray-400">Active Traders</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">$50M+</div>
                <div className="text-sm text-gray-400">Funded Accounts</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">$2M+</div>
                <div className="text-sm text-gray-400">Total Payouts</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">35%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">Why Choose EdgeFlow Capital</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: 'Instant Funding', desc: 'Get funded in as little as 24 hours after passing your challenge.' },
                { icon: DollarSign, title: '80% Profit Split', desc: 'Keep up to 80% of your profits with our industry-leading split.' },
                { icon: Shield, title: 'No Risk to You', desc: 'Trade with our capital. You only pay the challenge fee.' },
                { icon: Clock, title: '24/7 Support', desc: 'Our team of traders is available around the clock to help.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '01', title: 'Choose Your Plan', desc: 'Select a challenge plan that fits your trading style and goals.' },
                { number: '02', title: 'Pass the Challenge', desc: 'Meet the profit targets and risk rules within the challenge period.' },
                { number: '03', title: 'Get Funded', desc: 'Receive your funded account and start trading for real profits.' },
                { number: '04', title: 'Scale Up', desc: 'Scale your account size up to $200,000 based on performance.' },
              ].map((step, index) => (
                <div key={step.number} className="relative">
                  {index < 3 && <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200" />}
                  <div className="relative z-10">
                    <div className="text-5xl font-bold text-black mb-4">{step.number}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Trading?</h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8">
              Join thousands of traders who are already funded with EdgeFlow Capital.
            </p>
            <Link href="/challenges" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-50">
              Start Your Challenge
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EF</span>
                </div>
                <span className="text-xl font-bold text-white">EdgeFlow Capital</span>
              </Link>
              <p className="text-sm text-gray-400 mb-4">
                Prove your skills in our funded trading program and access capital up to $200,000.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-sm hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="text-sm hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/challenges" className="text-sm hover:text-white transition-colors">Challenges</Link></li>
                <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/rules" className="text-sm hover:text-white transition-colors">Rules</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/help" className="text-sm hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="text-sm hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">© 2024 EdgeFlow Capital. All rights reserved.</p>
              <p className="text-sm text-gray-400">Trading involves substantial risk of loss. Past performance does not guarantee future results.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
