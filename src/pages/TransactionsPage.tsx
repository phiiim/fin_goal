import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/calculations'
import type { TransactionCategory } from '@/types'
import dayjs from 'dayjs'

const CATEGORIES: { value: TransactionCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'Food & drink', icon: '🍜' },
  { value: 'transport', label: 'Transport', icon: '🚇' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'utilities', label: 'Utilities', icon: '💡' },
  { value: 'health', label: 'Health', icon: '💊' },
  { value: 'savings', label: 'Savings', icon: '🏦' },
  { value: 'income', label: 'Income', icon: '💰' },
  { value: 'other', label: 'Other', icon: '📦' },
]

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction, user, getCategorySpend } = useAppStore()
  const currency = useAppStore((s) => s.currency)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '', merchant: '', category: 'food' as TransactionCategory, note: ''
  })

  const save = () => {
    if (!form.amount) return
    addTransaction({
      userId: user?.id || '',
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      merchant: form.merchant || 'Unknown',
      note: form.note,
      date: dayjs().toISOString(),
      source: 'manual',
    })
    setForm({ type: 'expense', amount: '', merchant: '', category: 'food', note: '' })
    setAdding(false)
  }

  const catSpend = getCategorySpend()
  const totalSpend = Object.values(catSpend).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
        <Button className="text-xs px-3 py-2" onClick={() => setAdding(true)}>+ Add</Button>
      </div>

      {adding && (
        <Card>
          <div className="flex gap-2 mb-4">
            {(['expense', 'income'] as const).map((t) => (
              <button key={t} onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  form.type === t ? 'bg-brand-400 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{t === 'expense' ? '↑ Expense' : '↓ Income'}</button>
            ))}
          </div>
          <div className="space-y-3">
            <input type="number" placeholder={`Amount (${currency})`} value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
            <input placeholder="Merchant / from" value={form.merchant}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.filter(c => form.type === 'income' ? c.value === 'income' || c.value === 'other' : c.value !== 'income').map((c) => (
                <button key={c.value} onClick={() => setForm({ ...form, category: c.value })}
                  className={`p-2 rounded-xl border text-xs text-center transition-all ${
                    form.category === c.value ? 'border-brand-400 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500'
                  }`}>
                  <span className="block">{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1" onClick={save}>Save</Button>
            <Button variant="secondary" className="flex-1" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {totalSpend > 0 && (
        <Card>
          <h2 className="text-sm font-medium text-gray-700 mb-3">This month by category</h2>
          <div className="space-y-2">
            {Object.entries(catSpend).sort(([,a],[,b]) => b-a).map(([cat, amount]) => {
              const info = CATEGORIES.find(c => c.value === cat)
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-base w-6">{info?.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-600">{info?.label || cat}</span>
                      <span className="font-medium">{formatCurrency(amount, currency)}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div className="h-1 bg-brand-400 rounded-full" style={{ width: `${(amount/totalSpend)*100}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {transactions.length === 0 && !adding && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">↕</p>
            <p className="text-sm">No transactions yet. Add one above!</p>
          </div>
        )}
        {transactions.map((tx) => {
          const info = CATEGORIES.find(c => c.value === tx.category)
          return (
            <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-gray-50">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                {info?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{tx.merchant}</p>
                <p className="text-xs text-gray-400">{info?.label} · {dayjs(tx.date).format('D MMM')}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                </p>
                <button onClick={() => deleteTransaction(tx.id)} className="text-xs text-gray-300 hover:text-red-400">remove</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
