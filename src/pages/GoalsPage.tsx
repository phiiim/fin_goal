import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatThaiCurrency, monthsToReadable } from '@/lib/calculations'
import type { GoalCategory } from '@/types'
import dayjs from 'dayjs'

const GOAL_PRESETS = [
  { name: 'Honda City', category: 'vehicle' as GoalCategory, amount: 600000 },
  { name: 'Japan trip', category: 'travel' as GoalCategory, amount: 80000 },
  { name: 'Condo down payment', category: 'property' as GoalCategory, amount: 500000 },
  { name: 'Emergency fund', category: 'emergency' as GoalCategory, amount: 90000 },
  { name: 'iPhone', category: 'gadget' as GoalCategory, amount: 35000 },
  { name: 'MacBook', category: 'gadget' as GoalCategory, amount: 65000 },
]

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, user, deleteGoal } = useAppStore()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', months: '12' })
  const monthlyFree = (user?.monthlyIncome || 0) - (user?.monthlyExpenses || 0)

  const saveGoal = () => {
    if (!form.name || !form.amount) return
    addGoal({
      userId: user?.id || '',
      name: form.name,
      targetAmount: Number(form.amount),
      currentAmount: 0,
      targetDate: dayjs().add(Number(form.months), 'month').toISOString(),
      category: 'other',
      status: 'active',
    })
    setForm({ name: '', amount: '', months: '12' })
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">My goals</h1>
        <Button variant="primary" className="text-xs px-3 py-2" onClick={() => setAdding(true)}>+ Add goal</Button>
      </div>

      {adding && (
        <Card>
          <h2 className="text-sm font-medium text-gray-700 mb-3">New goal</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {GOAL_PRESETS.map((p) => (
              <button key={p.name} onClick={() => setForm({ ...form, name: p.name, amount: String(p.amount) })}
                className="text-left p-2 rounded-lg border border-gray-200 text-xs hover:border-brand-400 transition-colors">
                <p className="font-medium">{p.name}</p>
                <p className="text-gray-400">{formatThaiCurrency(p.amount)}</p>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
              placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
              placeholder="Target amount (฿)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <div>
              <label className="text-xs text-gray-500">Target: {form.months} months</label>
              <input type="range" min="1" max="60" value={form.months} className="w-full mt-1"
                onChange={(e) => setForm({ ...form, months: e.target.value })} />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1 month</span><span>5 years</span>
              </div>
            </div>
            {form.amount && (
              <div className="bg-brand-50 rounded-xl p-3 text-sm">
                <p className="text-brand-600 font-medium">
                  Save {formatThaiCurrency(Number(form.amount) / Number(form.months))}/month
                </p>
                <p className="text-brand-400 text-xs mt-0.5">
                  {Math.round(((Number(form.amount) / Number(form.months)) / Math.max(monthlyFree, 1)) * 100)}% of your free cash
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1" onClick={saveGoal}>Save goal</Button>
            <Button variant="secondary" className="flex-1" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {goals.length === 0 && !adding && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">◎</p>
          <p className="text-sm">No goals yet. Add one to get started!</p>
        </div>
      )}

      {goals.map((g) => {
        const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
        const monthlyNeeded = (g.targetAmount - g.currentAmount) /
          Math.max(dayjs(g.targetDate).diff(dayjs(), 'month'), 1)
        return (
          <Card key={g.id}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-gray-900">{g.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatThaiCurrency(g.currentAmount)} of {formatThaiCurrency(g.targetAmount)}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${pct >= 100 ? 'bg-green-100 text-green-600' : 'bg-brand-50 text-brand-600'}`}>
                {pct}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-3">
              <div className="h-2 bg-brand-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>Save {formatThaiCurrency(monthlyNeeded)}/mo to stay on track</span>
              <span>{monthsToReadable(dayjs(g.targetDate).diff(dayjs(), 'month'))} left</span>
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="Add savings (฿)" id={`add-${g.id}`}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" />
              <Button variant="secondary" className="text-xs" onClick={() => {
                const el = document.getElementById(`add-${g.id}`) as HTMLInputElement
                const val = Number(el.value)
                if (val > 0) { updateGoal(g.id, { currentAmount: g.currentAmount + val }); el.value = '' }
              }}>+ Add</Button>
              <button
                onClick={() => {
                  if (confirm('Delete this goal? This cannot be undone.')) deleteGoal(g.id)
                }}
                className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
