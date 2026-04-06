import Link from 'next/link'
import { TrendingUp, BarChart2, BookMarked, Brain, Shield, Zap, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  { icon: BarChart2, title: '50+ Analytics Reports', desc: 'Deep insights into your trading performance with equity curves, drawdown analysis, and more.' },
  { icon: BookMarked, title: 'Playbook System', desc: 'Document and track your trading strategies. Know which setups work and which to avoid.' },
  { icon: Brain, title: 'Psychology Tracking', desc: 'Monitor your mental state and emotions. Identify psychological patterns affecting your trades.' },
  { icon: Zap, title: 'Trade Journal', desc: 'Log trades in seconds. Auto-calculate P&L, R:R, and R-Multiple from your entries.' },
  { icon: Shield, title: 'Risk Management', desc: 'Track your risk per trade, drawdowns, and position sizing across all your accounts.' },
  { icon: TrendingUp, title: 'CSV Import', desc: 'Import trades from Interactive Brokers, TD Ameritrade, Binance, and 500+ brokers.' },
]

const PRICING = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    features: ['Up to 100 trades', 'Basic analytics', 'Trade journal', 'CSV import'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Basic',
    price: '$29',
    period: '/month',
    features: ['Unlimited trades', '20+ analytics charts', 'Playbook system', 'CSV import', 'Email support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    features: ['Everything in Basic', '50+ analytics reports', 'Psychology tracking', 'Multi-account', 'Priority support', 'API access'],
    cta: 'Go Pro',
    highlight: true,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      {/* Nav */}
      <nav className="border-b border-[#2a2a40] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">TradeJournal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Sign In</Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm mb-6">
          <Zap className="w-3.5 h-3.5" />
          50+ Analytics Reports • 500+ Broker Integrations • Track Any Asset
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          The Trading Journal That<br />
          <span className="text-indigo-400">Makes You Profitable</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop guessing what works. TradeJournal gives you the analytics, insights, and accountability system every serious trader needs to grow consistently.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 text-base font-semibold gap-2">
              Start Free Trial <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-[#2a2a40] text-slate-300 hover:text-white px-8 py-3 text-base">
              View Demo
            </Button>
          </Link>
        </div>
        <p className="text-slate-500 text-sm mt-4">14 days free • No credit card required</p>
      </section>

      {/* Stats banner */}
      <section className="border-y border-[#2a2a40] bg-[#1a1a24]">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '50+', label: 'Analytics Reports' },
            { value: '500+', label: 'Broker Integrations' },
            { value: '10k+', label: 'Active Traders' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-indigo-400 mb-1">{s.value}</div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Everything You Need to Win</h2>
        <p className="text-slate-400 text-center mb-12">All the tools serious traders use to improve their performance</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#1a1a24] border border-[#2a2a40] rounded-xl p-6 hover:border-indigo-600/30 transition-all group">
              <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600/20 transition-colors">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Simple, Transparent Pricing</h2>
        <p className="text-slate-400 text-center mb-12">Start free, upgrade when ready</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING.map(plan => (
            <div
              key={plan.name}
              className={`rounded-xl p-6 border ${
                plan.highlight
                  ? 'bg-indigo-600/10 border-indigo-600/40 relative'
                  : 'bg-[#1a1a24] border-[#2a2a40]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-white font-semibold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button
                  className={`w-full ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'border border-[#2a2a40] text-white hover:bg-white/5 bg-transparent'}`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#2a2a40] bg-[#1a1a24]">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Trade Smarter?</h2>
          <p className="text-slate-400 mb-8">Join thousands of traders using TradeJournal to improve their performance.</p>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 text-base font-semibold">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a40] px-6 py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} TradeJournal. Built for serious traders.
      </footer>
    </div>
  )
}
