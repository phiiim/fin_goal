import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import Button from '@/components/ui/Button'
import dayjs from 'dayjs'
import { formatCurrency } from '@/lib/calculations'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const users = useAppStore((s) => s.users)
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)
  const switchUser = useAppStore((s) => s.switchUser)
  const deleteUser = useAppStore((s) => s.deleteUser)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', income: '', expenses: '', savings: '' })
  const currency = useAppStore((s) => s.currency)
  const setCurrency = useAppStore((s) => s.setCurrency)

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const finish = () => {
    setUser({
      id: crypto.randomUUID(),
      name: form.name || 'Friend',
      monthlyIncome: Number(form.income),
      monthlyExpenses: Number(form.expenses),
      currentSavings: Number(form.savings),
      createdAt: dayjs().toISOString(),
    })
    navigate('/')
  }

  const steps = [
    {
      title: "Hello! 👋",
      subtitle: "FinGoal helps you reach your financial goals",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Your name</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
              placeholder="e.g. Ploy" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Currency</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="THB">Thai Baht (THB)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="JPY">Japanese Yen (JPY)</option>
            </select>
          </div>
        </div>
      ),
      canNext: true,
    },
    {
      title: "Your income & expenses",
      subtitle: "We'll use this to calculate your saving power",
      content: (
        <div className="space-y-4">
          {[
            { key: 'income', label: 'Monthly income (฿)', placeholder: '35,000' },
            { key: 'expenses', label: 'Monthly expenses (฿)', placeholder: '22,000' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm text-gray-500 mb-1">{label}</label>
              <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
                placeholder={placeholder} value={form[key as keyof typeof form]}
                onChange={(e) => update(key, e.target.value)} />
            </div>
          ))}
        </div>
      ),
      canNext: !!form.income && !!form.expenses,
    },
    {
      title: "Current savings",
      subtitle: "How much do you have saved right now?",
      content: (
        <div>
          <label className="block text-sm text-gray-500 mb-1">Total savings (฿)</label>
          <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
            placeholder="50,000" value={form.savings} onChange={(e) => update('savings', e.target.value)} />
          <p className="text-xs text-gray-400 mt-2">Include all bank accounts, piggy banks, everything.</p>
        </div>
      ),
      canNext: !!form.savings,
    },
  ]

  const s = steps[step]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white px-6">
      <div className="w-full max-w-sm">
        {users.length > 0 && (
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Saved profiles</p>
            <div className="mt-3 space-y-2">
              {users.map((profile) => (
                <div
                  key={profile.id}
                  className={`w-full rounded-xl border px-3 py-3 transition-colors ${user?.id === profile.id ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                      <p className="text-xs text-gray-400">Income {formatCurrency(profile.monthlyIncome, profile.id ? (profile as any).currency ?? 'THB' : 'THB')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {user?.id === profile.id && <span className="text-xs font-medium text-brand-500">Active</span>}
                      <button
                        onClick={() => {
                          if (!confirm(`Delete profile \"${profile.name}\"? This cannot be undone.`)) return
                          deleteUser(profile.id)
                        }}
                        className="text-xs font-medium text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      switchUser(profile.id)
                      navigate('/')
                    }}
                    className="mt-2 text-xs font-medium text-brand-500"
                  >
                    Switch to this profile
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Switch profiles above or create a fresh one below.</p>
          </div>
        )}
        <div className="flex gap-1 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-400' : 'bg-gray-200'}`} />
          ))}
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{s.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{s.subtitle}</p>
        {s.content}
        <div className="mt-8">
          {step < steps.length - 1 ? (
            <Button className="w-full" disabled={!s.canNext} onClick={() => setStep(step + 1)}>
              Continue →
            </Button>
          ) : (
            <Button className="w-full" disabled={!s.canNext} onClick={finish}>
              Let's go! 🚀
            </Button>
          )}
          {step > 0 && (
            <button className="w-full text-sm text-gray-400 mt-3" onClick={() => setStep(step - 1)}>Back</button>
          )}
        </div>
      </div>
    </div>
  )
}
