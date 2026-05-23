import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Card from '@/components/ui/Card'
import { formatThaiCurrency } from '@/lib/calculations'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user, goals, getMonthlySpend, updateUser } = useAppStore()
  const navigate = useNavigate()
  const monthlySpend = getMonthlySpend()
  const monthlyFree = (user?.monthlyIncome || 0) - (user?.monthlyExpenses || 0)
  const activeGoals = goals.filter((g) => g.status === 'active')
  const [editing, setEditing] = useState<null | 'income' | 'expenses' | 'savings'>(null)
  const [value, setValue] = useState<string>('')

  const startEdit = (field: 'income' | 'expenses' | 'savings') => {
    setEditing(field)
    if (field === 'income') setValue(String(user?.monthlyIncome ?? ''))
    if (field === 'expenses') setValue(String(user?.monthlyExpenses ?? ''))
    if (field === 'savings') setValue(String(user?.currentSavings ?? ''))
  }

  const cancelEdit = () => {
    setEditing(null)
    setValue('')
  }

  const saveEdit = () => {
    if (!user) return
    const num = Number(value) || 0
    if (editing === 'income') updateUser({ monthlyIncome: num })
    if (editing === 'expenses') updateUser({ monthlyExpenses: num })
    if (editing === 'savings') updateUser({ currentSavings: num })
    cancelEdit()
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">Good day,</p>
        <h1 className="text-2xl font-semibold text-gray-900">{user?.name} 👋</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'income', label: 'Monthly income', value: formatThaiCurrency(user?.monthlyIncome || 0), sub: 'per month' },
          { key: 'expenses', label: 'Free cash', value: formatThaiCurrency(monthlyFree), sub: 'after expenses', ok: monthlyFree > 0 },
          { key: 'savings', label: 'Savings', value: formatThaiCurrency(user?.currentSavings || 0), sub: 'total saved' },
          { key: 'spent', label: 'Spent this month', value: formatThaiCurrency(monthlySpend), sub: 'tracked' },
        ].map((m) => (
          <Card key={m.label} className="bg-gray-50 border-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                {editing === 'income' && m.key === 'income' ? (
                  <div className="flex items-center gap-2">
                    <input className="w-32 border rounded px-2 py-1 text-sm" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                    <button className="text-xs text-brand-600" onClick={saveEdit}>Save</button>
                    <button className="text-xs text-gray-400" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : editing === 'expenses' && m.key === 'expenses' ? (
                  <div className="flex items-center gap-2">
                    <input className="w-32 border rounded px-2 py-1 text-sm" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                    <button className="text-xs text-brand-600" onClick={saveEdit}>Save</button>
                    <button className="text-xs text-gray-400" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : editing === 'savings' && m.key === 'savings' ? (
                  <div className="flex items-center gap-2">
                    <input className="w-32 border rounded px-2 py-1 text-sm" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                    <button className="text-xs text-brand-600" onClick={saveEdit}>Save</button>
                    <button className="text-xs text-gray-400" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => {
                      if (m.key === 'income') startEdit('income')
                      if (m.key === 'expenses') startEdit('expenses')
                      if (m.key === 'savings') startEdit('savings')
                    }} className={`text-left cursor-pointer`}>
                      <p className={`text-lg font-semibold ${m.ok === false ? 'text-red-500' : 'text-gray-900'}`}>{m.value}</p>
                      <p className="text-xs text-gray-400">{m.sub}</p>
                    </button>
                  </>
                )}
              </div>
              <div />
            </div>
          </Card>
        ))}
      </div>

      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Active goals</h2>
          <div className="space-y-3">
            {activeGoals.slice(0, 3).map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
              return (
                <Card key={g.id} className="cursor-pointer hover:border-brand-100" onClick={() => navigate('/goals')}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-gray-900">{g.name}</p>
                    <p className="text-xs text-gray-400">{pct}%</p>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className="h-1.5 bg-brand-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-400">{formatThaiCurrency(g.currentAmount)}</p>
                    <p className="text-xs text-gray-400">{formatThaiCurrency(g.targetAmount)}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-brand-100 bg-brand-50 cursor-pointer" onClick={() => navigate('/check')}>
          <div className="flex items-center gap-2">
            <span className="text-xl">✓</span>
            <div>
              <p className="text-xs font-medium text-brand-600">Can I afford it?</p>
              <p className="text-xs text-brand-400">Quick check</p>
            </div>
          </div>
        </Card>
        <Card className="border-purple-100 bg-purple-50 cursor-pointer" onClick={() => navigate('/calculator')}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🧮</span>
            <div>
              <p className="text-xs font-medium text-purple-700">How much to save?</p>
              <p className="text-xs text-purple-400">Monthly planner</p>
            </div>
          </div>
        </Card>
        <Card className="border-amber-100 bg-amber-50 cursor-pointer" onClick={() => navigate('/vault')}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-xs font-medium text-amber-700">My vaults</p>
              <p className="text-xs text-amber-400">Locked savings</p>
            </div>
          </div>
        </Card>
        <Card className="border-blue-100 bg-blue-50 cursor-pointer" onClick={() => navigate('/retirement')}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏖️</span>
            <div>
              <p className="text-xs font-medium text-blue-700">Retirement</p>
              <p className="text-xs text-blue-400">Plan your future</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
