import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { calculateAffordability, formatThaiCurrency, monthsToReadable } from '@/lib/calculations'
import type { AffordabilityResult } from '@/types'

const PRESETS = [
  { name: 'iPhone 16', price: 35000, icon: '📱' },
  { name: 'Honda City', price: 600000, icon: '🚗' },
  { name: 'Japan trip', price: 80000, icon: '✈️' },
  { name: 'Condo down', price: 500000, icon: '🏠' },
  { name: 'MacBook Pro', price: 65000, icon: '💻' },
  { name: 'PS5', price: 18000, icon: '🎮' },
]

export default function AffordabilityPage() {
  const user = useAppStore((s) => s.user)
  const [income, setIncome] = useState(String(user?.monthlyIncome || ''))
  const [expenses, setExpenses] = useState(String(user?.monthlyExpenses || ''))
  const [savings, setSavings] = useState(String(user?.currentSavings || ''))
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [result, setResult] = useState<AffordabilityResult | null>(null)

  const selectPreset = (name: string, price: number) => {
    setItemName(name); setItemPrice(String(price))
  }

  const check = () => {
    if (!income || !itemPrice) return
    const r = calculateAffordability(
      Number(income), Number(expenses), Number(savings), Number(itemPrice), itemName
    )
    setResult(r)
    setTimeout(() => document.getElementById('result-top')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const scoreColor = result
    ? result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-amber-600' : 'text-red-500'
    : ''
  const scoreBg = result
    ? result.score >= 80 ? 'bg-green-50 border-green-200' : result.score >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
    : ''

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Can I afford it?</h1>

      <Card>
        <h2 className="text-sm font-medium text-gray-700 mb-3">Your finances (฿/month)</h2>
        <div className="space-y-3">
          {[
            { label: 'Monthly income', val: income, set: setIncome, ph: '35,000' },
            { label: 'Monthly expenses', val: expenses, set: setExpenses, ph: '22,000' },
            { label: 'Current savings', val: savings, set: setSavings, ph: '50,000' },
          ].map(({ label, val, set, ph }) => (
            <div key={label}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)}
                placeholder={ph}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-gray-700 mb-3">What do you want to buy?</h2>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {PRESETS.map((p) => (
            <button key={p.name} onClick={() => selectPreset(p.name, p.price)}
              className={`p-2 rounded-xl border text-center text-xs transition-all ${
                itemName === p.name ? 'border-brand-400 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              <span className="block text-lg mb-0.5">{p.icon}</span>
              <p className="font-medium leading-tight">{p.name}</p>
              <p className="text-gray-400 mt-0.5">{formatThaiCurrency(p.price)}</p>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={itemName} onChange={(e) => setItemName(e.target.value)}
            placeholder="Or type your own..." 
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
          <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)}
            placeholder="฿ price"
            className="w-28 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
        </div>
      </Card>

      <Button className="w-full py-3" onClick={check}>Check affordability →</Button>

      {result && (
        <div id="result-top" className="space-y-4 pt-2">
          <Card className={`border ${scoreBg}`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${scoreBg} border flex flex-col items-center justify-center flex-shrink-0`}>
                <span className={`text-2xl font-semibold ${scoreColor}`}>{result.score}</span>
                <span className={`text-xs ${scoreColor}`}>/ 100</span>
              </div>
              <div>
                <p className={`font-semibold text-base ${scoreColor}`}>{result.label} — {itemName}</p>
                <p className="text-sm text-gray-500 mt-0.5">{result.verdict}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Item cost', val: formatThaiCurrency(Number(itemPrice)), sub: `${result.pctOfIncome.toFixed(0)}% of monthly income` },
              { label: 'Monthly free cash', val: formatThaiCurrency(result.monthlyFree), sub: 'after expenses' },
              { label: 'Gap to cover', val: result.gap > 0 ? formatThaiCurrency(result.gap) : '฿0', sub: result.gap > 0 ? 'still needed' : 'already covered' },
              { label: 'Months to goal', val: result.gap > 0 ? String(result.monthsNeeded) : '0', sub: 'saving 50% of free cash' },
            ].map((m) => (
              <Card key={m.label} className="bg-gray-50 border-0">
                <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                <p className="text-lg font-semibold text-gray-900">{m.val}</p>
                <p className="text-xs text-gray-400">{m.sub}</p>
              </Card>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Financial impact</h3>
            <div className="space-y-2">
              {result.impacts.map((imp, i) => (
                <Card key={i} className={`border-l-2 ${
                  imp.color === 'success' ? 'border-l-green-400' :
                  imp.color === 'warning' ? 'border-l-amber-400' : 'border-l-red-400'
                }`} style={{ borderRadius: '0 12px 12px 0' }}>
                  <p className="text-sm font-medium text-gray-900 mb-1">{imp.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{imp.body}</p>
                </Card>
              ))}
            </div>
          </div>

          {result.gap > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Savings timeline</h3>
              <Card>
                <div className="space-y-3">
                  {result.timelineOptions.map((t) => (
                    <div key={t.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{t.label}</span>
                        <span className="font-medium text-gray-900">{monthsToReadable(t.months)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className={`h-1.5 rounded-full ${
                          t.months <= 6 ? 'bg-green-400' : t.months <= 18 ? 'bg-amber-400' : 'bg-red-400'
                        }`} style={{ width: `${Math.max(10, 100 - (t.months / Math.max(...result.timelineOptions.map(x => x.months))) * 80)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ways to get there faster</h3>
            <div className="space-y-2">
              {result.moneyTips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start text-sm text-gray-600">
                  <span className="text-brand-400 mt-0.5 flex-shrink-0">→</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
