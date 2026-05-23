import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/calculations'

const VAULT_COLORS = [
  { label: 'Teal',   value: '#1D9E75' },
  { label: 'Blue',   value: '#378ADD' },
  { label: 'Purple', value: '#7F77DD' },
  { label: 'Coral',  value: '#D85A30' },
  { label: 'Amber',  value: '#BA7517' },
]

const VAULT_PRESETS = [
  { name: 'Emergency fund',     target: 90000,  reason: 'Cover 3 months of expenses',    icon: '🛡️' },
  { name: 'Car down payment',   target: 150000, reason: 'Honda City / Toyota Yaris',     icon: '🚗' },
  { name: 'Condo down payment', target: 500000, reason: '10% down on a condo',           icon: '🏠' },
  { name: 'Japan trip',         target: 80000,  reason: 'Flights + hotel + spending',    icon: '✈️' },
  { name: 'Wedding fund',       target: 200000, reason: 'Dream wedding budget',           icon: '💍' },
  { name: 'Investment seed',    target: 100000, reason: 'Start investing in stocks/ETF',  icon: '📈' },
]

export default function VaultPage() {
  const { vaults, addVault, depositToVault, deleteVault, updateVault } = useAppStore()
  const currency = useAppStore((s) => s.currency)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', target: '', reason: '', color: '#1D9E75', locked: true })
  const [depositMap, setDepositMap] = useState<Record<string, string>>({})

  const totalVaulted = vaults.reduce((s, v) => s + v.currentAmount, 0)
  const totalTarget = vaults.reduce((s, v) => s + v.targetAmount, 0)

  const saveVault = () => {
    if (!form.name || !form.target) return
    addVault({
      userId: '',
      name: form.name,
      targetAmount: Number(form.target),
      currentAmount: 0,
      color: form.color,
      locked: form.locked,
      reason: form.reason,
    })
    setForm({ name: '', target: '', reason: '', color: '#1D9E75', locked: true })
    setAdding(false)
  }

  const handleDeposit = (id: string) => {
    const val = Number(depositMap[id] || 0)
    if (val > 0) {
      depositToVault(id, val)
      setDepositMap((m) => ({ ...m, [id]: '' }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My vaults</h1>
          <p className="text-xs text-gray-400 mt-0.5">Money you don't want to touch</p>
        </div>
        <Button className="text-xs px-3 py-2" onClick={() => setAdding(true)}>+ New vault</Button>
      </div>

      {vaults.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gray-50 border-0">
            <p className="text-xs text-gray-400 mb-1">Total vaulted</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalVaulted, currency)}</p>
          </Card>
          <Card className="bg-gray-50 border-0">
            <p className="text-xs text-gray-400 mb-1">Total target</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalTarget, currency)}</p>
          </Card>
        </div>
      )}

      {adding && (
        <Card>
          <h2 className="text-sm font-medium text-gray-700 mb-3">New vault</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {VAULT_PRESETS.map((p) => (
              <button key={p.name}
                onClick={() => setForm({ ...form, name: p.name, target: String(p.target), reason: p.reason })}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  form.name === p.name ? 'border-brand-400 bg-brand-50' : 'border-gray-200'
                }`}>
                <span className="text-base block mb-1">{p.icon}</span>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-gray-400 mt-0.5">{formatCurrency(p.target, currency)}</p>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <input placeholder="Vault name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
            <input type="number" placeholder={`Target amount (${currency})`} value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
            <input placeholder="Why are you saving this? (optional)" value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />

            <div>
              <p className="text-xs text-gray-500 mb-2">Vault colour</p>
              <div className="flex gap-2">
                {VAULT_COLORS.map((c) => (
                  <button key={c.value} onClick={() => setForm({ ...form, color: c.value })}
                    style={{ background: c.value }}
                    className={`w-8 h-8 rounded-full transition-transform ${form.color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-300' : ''}`} />
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm({ ...form, locked: !form.locked })}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.locked ? 'bg-brand-400' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.locked ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-sm text-gray-600">Lock this vault (no withdrawals reminder)</span>
            </label>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="flex-1" onClick={saveVault}>Create vault</Button>
            <Button variant="secondary" className="flex-1" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {vaults.length === 0 && !adding && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🔒</p>
          <p className="text-sm font-medium text-gray-500">No vaults yet</p>
          <p className="text-xs mt-1">Create a vault for money you don't want to touch</p>
        </div>
      )}

      <div className="space-y-3">
        {vaults.map((v) => {
          const pct = Math.min(100, Math.round((v.currentAmount / v.targetAmount) * 100))
          const remaining = v.targetAmount - v.currentAmount
          return (
            <Card key={v.id}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{ background: v.color }}>
                  {v.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">{v.name}</p>
                    {v.locked && <span className="text-xs">🔒</span>}
                  </div>
                  {v.reason && <p className="text-xs text-gray-400 truncate">{v.reason}</p>}
                </div>
                <button onClick={() => deleteVault(v.id)} className="text-xs text-gray-300 hover:text-red-400 flex-shrink-0">✕</button>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{formatCurrency(v.currentAmount, currency)} saved</span>
                <span>{formatCurrency(v.targetAmount, currency)} goal</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full mb-1">
                <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: v.color }} />
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: v.color }}>{pct}% there</span>
                <span className="text-xs text-gray-400">{remaining > 0 ? `${formatCurrency(remaining, currency)} to go` : '✓ Goal reached!'}</span>
              </div>

              {!v.locked || v.currentAmount < v.targetAmount ? (
                <div className="flex gap-2">
                  <input type="number" placeholder={`Deposit ${currency}`}
                    value={depositMap[v.id] || ''}
                    onChange={(e) => setDepositMap((m) => ({ ...m, [v.id]: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" />
                  <Button variant="secondary" className="text-xs px-3"
                    onClick={() => handleDeposit(v.id)}>+ Add</Button>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl px-3 py-2 text-center">
                  <p className="text-xs text-green-600 font-medium">🎉 Vault complete!</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
