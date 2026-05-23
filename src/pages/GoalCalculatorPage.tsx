import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatThaiCurrency, monthsToReadable } from '@/lib/calculations'

const PRESETS = [
  { name: 'Honda City',         price: 600000,  icon: '🚗', down: 0.2 },
  { name: 'Toyota Yaris',       price: 500000,  icon: '🚙', down: 0.2 },
  { name: 'Condo (฿3M)',        price: 3000000, icon: '🏠', down: 0.1 },
  { name: 'Condo (฿5M)',        price: 5000000, icon: '🏢', down: 0.1 },
  { name: 'Japan trip',         price: 80000,   icon: '✈️', down: 1   },
  { name: 'Europe trip',        price: 150000,  icon: '🌍', down: 1   },
  { name: 'iPhone 16 Pro',      price: 45000,   icon: '📱', down: 1   },
  { name: 'MacBook Pro M4',     price: 75000,   icon: '💻', down: 1   },
  { name: 'Emergency fund 3mo', price: 90000,   icon: '🛡️', down: 1   },
  { name: 'Wedding',            price: 300000,  icon: '💍', down: 1   },
]

export default function GoalCalculatorPage() {
  const user = useAppStore((s) => s.user)
  const monthlyFree = (user?.monthlyIncome || 0) - (user?.monthlyExpenses || 0)
  const currentSavings = user?.currentSavings || 0

  const [selectedPreset, setSelectedPreset] = useState<typeof PRESETS[0] | null>(null)
  const [customName, setCustomName] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [downPct, setDownPct] = useState(100) // % of total you need to save (100 = full price, 20 = down payment)
  const [targetMonths, setTargetMonths] = useState(12)
  const [useExistingSavings, setUseExistingSavings] = useState(true)

  const name = customName || selectedPreset?.name || ''
  const totalPrice = Number(customPrice) || selectedPreset?.price || 0
  const amountNeeded = Math.round(totalPrice * (downPct / 100))
  const alreadyHave = useExistingSavings ? Math.min(currentSavings, amountNeeded) : 0
  const gap = Math.max(0, amountNeeded - alreadyHave)
  const monthlyNeeded = targetMonths > 0 ? Math.ceil(gap / targetMonths) : 0
  const pctOfFree = monthlyFree > 0 ? Math.round((monthlyNeeded / monthlyFree) * 100) : 0
  const realisticMonths = monthlyFree > 0 ? Math.ceil(gap / (monthlyFree * 0.5)) : 999
  const aggressiveMonths = monthlyFree > 0 ? Math.ceil(gap / (monthlyFree * 0.8)) : 999

  const feasibility =
    pctOfFree <= 30 ? { label: 'Very doable', color: 'text-green-600', bg: 'bg-green-50 border-green-100' } :
    pctOfFree <= 60 ? { label: 'Tight but possible', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' } :
    pctOfFree <= 100 ? { label: 'Very tight', color: 'text-red-500', bg: 'bg-red-50 border-red-100' } :
    { label: 'Not possible at current income', color: 'text-red-600', bg: 'bg-red-50 border-red-200' }

  const selectPreset = (p: typeof PRESETS[0]) => {
    setSelectedPreset(p)
    setCustomName('')
    setCustomPrice('')
    setDownPct(Math.round(p.down * 100))
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">How much to save?</h1>
        <p className="text-xs text-gray-400 mt-0.5">Plan your monthly savings for any goal</p>
      </div>

      <Card>
        <h2 className="text-sm font-medium text-gray-700 mb-3">Pick a goal</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {PRESETS.map((p) => (
            <button key={p.name} onClick={() => selectPreset(p)}
              className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                selectedPreset?.name === p.name ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
              <span className="text-base block mb-0.5">{p.icon}</span>
              <p className="font-medium text-gray-800 leading-tight">{p.name}</p>
              <p className="text-gray-400 mt-0.5">{formatThaiCurrency(p.price)}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input placeholder="Or type your own goal..."
            value={customName} onChange={(e) => { setCustomName(e.target.value); setSelectedPreset(null) }}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
          <input type="number" placeholder="฿ price"
            value={customPrice} onChange={(e) => { setCustomPrice(e.target.value); setSelectedPreset(null) }}
            className="w-28 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
        </div>
      </Card>

      {totalPrice > 0 && (
        <>
          <Card>
            <h2 className="text-sm font-medium text-gray-700 mb-4">Customise your plan</h2>
            <div className="space-y-4">

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500">How much of the total do you need to save?</label>
                  <span className="text-xs font-medium text-brand-400">{downPct}%</span>
                </div>
                <input type="range" min="5" max="100" step="5" value={downPct}
                  onChange={(e) => setDownPct(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Down payment only</span>
                  <span>Full price</span>
                </div>
                <div className="mt-2 bg-gray-50 rounded-xl p-3 text-sm">
                  <p className="text-gray-600">You need to save: <span className="font-semibold text-gray-900">{formatThaiCurrency(amountNeeded)}</span></p>
                  {downPct < 100 && <p className="text-xs text-gray-400 mt-0.5">Remaining {formatThaiCurrency(totalPrice - amountNeeded)} via loan/financing</p>}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-500">Target timeline</label>
                  <span className="text-xs font-medium text-brand-400">{monthsToReadable(targetMonths)}</span>
                </div>
                <input type="range" min="1" max="60" step="1" value={targetMonths}
                  onChange={(e) => setTargetMonths(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 month</span><span>5 years</span>
                </div>
              </div>

              {currentSavings > 0 && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setUseExistingSavings(!useExistingSavings)}
                    className={`w-10 h-6 rounded-full relative transition-colors ${useExistingSavings ? 'bg-brand-400' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useExistingSavings ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-gray-600">
                    Use existing savings ({formatThaiCurrency(Math.min(currentSavings, amountNeeded))})
                  </span>
                </label>
              )}
            </div>
          </Card>

          <Card className={`border ${feasibility.bg}`}>
            <div className="flex items-start gap-3">
              <div>
                <p className={`text-2xl font-semibold ${feasibility.color}`}>{formatThaiCurrency(monthlyNeeded)}<span className="text-sm font-normal">/month</span></p>
                <p className="text-xs text-gray-500 mt-0.5">to reach {name ? `"${name}"` : 'your goal'} in {monthsToReadable(targetMonths)}</p>
              </div>
              <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${feasibility.color} ${feasibility.bg} border flex-shrink-0`}>
                {feasibility.label}
              </span>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gray-50 border-0">
              <p className="text-xs text-gray-400 mb-1">% of your free cash</p>
              <p className={`text-xl font-semibold ${pctOfFree > 80 ? 'text-red-500' : 'text-gray-900'}`}>{pctOfFree}%</p>
              <p className="text-xs text-gray-400">You have {formatThaiCurrency(monthlyFree)}/mo free</p>
            </Card>
            <Card className="bg-gray-50 border-0">
              <p className="text-xs text-gray-400 mb-1">Gap to cover</p>
              <p className="text-xl font-semibold text-gray-900">{formatThaiCurrency(gap)}</p>
              <p className="text-xs text-gray-400">{useExistingSavings && alreadyHave > 0 ? `After ฿${alreadyHave.toLocaleString()} savings` : 'From scratch'}</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Saving scenarios</h3>
            <div className="space-y-3">
              {[
                { label: 'Relaxed (30% of free cash)', monthly: Math.ceil(monthlyFree * 0.3), months: Math.ceil(gap / Math.max(monthlyFree * 0.3, 1)) },
                { label: 'Balanced (50% of free cash)', monthly: Math.ceil(monthlyFree * 0.5), months: realisticMonths },
                { label: 'Aggressive (80% of free cash)', monthly: Math.ceil(monthlyFree * 0.8), months: aggressiveMonths },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{s.label}</span>
                      <span className="font-medium text-gray-900">{formatThaiCurrency(s.monthly)}/mo</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className={`h-1.5 rounded-full ${
                        s.months <= 6 ? 'bg-green-400' : s.months <= 18 ? 'bg-amber-400' : 'bg-red-400'
                      }`} style={{ width: `${Math.max(5, Math.min(100, 100 - (s.months / 60) * 80))}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500 w-14 text-right flex-shrink-0">
                    {monthsToReadable(s.months)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {monthlyNeeded > monthlyFree && (
            <Card className="bg-red-50 border-red-100">
              <p className="text-sm font-medium text-red-700 mb-2">This timeline isn't realistic</p>
              <p className="text-xs text-red-600 leading-relaxed mb-3">
                You'd need more than your entire free cash. Try extending the timeline or increase income first.
              </p>
              <div className="space-y-1">
                <p className="text-xs text-red-600">→ Realistic timeline: <span className="font-semibold">{monthsToReadable(realisticMonths)}</span></p>
                <p className="text-xs text-red-600">→ Or earn <span className="font-semibold">{formatThaiCurrency(monthlyNeeded - monthlyFree)}/mo more</span> via freelance / side income</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
