import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatThaiCurrency } from '@/lib/calculations';
import dayjs from 'dayjs';
const CATEGORIES = [
    { value: 'food', label: 'Food & drink', icon: '🍜' },
    { value: 'transport', label: 'Transport', icon: '🚇' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'health', label: 'Health', icon: '💊' },
    { value: 'savings', label: 'Savings', icon: '🏦' },
    { value: 'income', label: 'Income', icon: '💰' },
    { value: 'other', label: 'Other', icon: '📦' },
];
export default function TransactionsPage() {
    const { transactions, addTransaction, deleteTransaction, user, getCategorySpend } = useAppStore();
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({
        type: 'expense',
        amount: '', merchant: '', category: 'food', note: ''
    });
    const save = () => {
        if (!form.amount)
            return;
        addTransaction({
            userId: user?.id || '',
            amount: Number(form.amount),
            type: form.type,
            category: form.category,
            merchant: form.merchant || 'Unknown',
            note: form.note,
            date: dayjs().toISOString(),
            source: 'manual',
        });
        setForm({ type: 'expense', amount: '', merchant: '', category: 'food', note: '' });
        setAdding(false);
    };
    const catSpend = getCategorySpend();
    const totalSpend = Object.values(catSpend).reduce((a, b) => a + b, 0);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Transactions" }), _jsx(Button, { className: "text-xs px-3 py-2", onClick: () => setAdding(true), children: "+ Add" })] }), adding && (_jsxs(Card, { children: [_jsx("div", { className: "flex gap-2 mb-4", children: ['expense', 'income'].map((t) => (_jsx("button", { onClick: () => setForm({ ...form, type: t }), className: `flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${form.type === t ? 'bg-brand-400 text-white' : 'bg-gray-100 text-gray-500'}`, children: t === 'expense' ? '↑ Expense' : '↓ Income' }, t))) }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "number", placeholder: "Amount (\u0E3F)", value: form.amount, onChange: (e) => setForm({ ...form, amount: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" }), _jsx("input", { placeholder: "Merchant / from", value: form.merchant, onChange: (e) => setForm({ ...form, merchant: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: CATEGORIES.filter(c => form.type === 'income' ? c.value === 'income' || c.value === 'other' : c.value !== 'income').map((c) => (_jsxs("button", { onClick: () => setForm({ ...form, category: c.value }), className: `p-2 rounded-xl border text-xs text-center transition-all ${form.category === c.value ? 'border-brand-400 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-500'}`, children: [_jsx("span", { className: "block", children: c.icon }), c.label] }, c.value))) })] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Button, { className: "flex-1", onClick: save, children: "Save" }), _jsx(Button, { variant: "secondary", className: "flex-1", onClick: () => setAdding(false), children: "Cancel" })] })] })), totalSpend > 0 && (_jsxs(Card, { children: [_jsx("h2", { className: "text-sm font-medium text-gray-700 mb-3", children: "This month by category" }), _jsx("div", { className: "space-y-2", children: Object.entries(catSpend).sort(([, a], [, b]) => b - a).map(([cat, amount]) => {
                            const info = CATEGORIES.find(c => c.value === cat);
                            return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-base w-6", children: info?.icon }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between text-xs mb-0.5", children: [_jsx("span", { className: "text-gray-600", children: info?.label || cat }), _jsx("span", { className: "font-medium", children: formatThaiCurrency(amount) })] }), _jsx("div", { className: "h-1 bg-gray-100 rounded-full", children: _jsx("div", { className: "h-1 bg-brand-400 rounded-full", style: { width: `${(amount / totalSpend) * 100}%` } }) })] })] }, cat));
                        }) })] })), _jsxs("div", { className: "space-y-2", children: [transactions.length === 0 && !adding && (_jsxs("div", { className: "text-center py-12 text-gray-400", children: [_jsx("p", { className: "text-3xl mb-2", children: "\u2195" }), _jsx("p", { className: "text-sm", children: "No transactions yet. Add one above!" })] })), transactions.map((tx) => {
                        const info = CATEGORIES.find(c => c.value === tx.category);
                        return (_jsxs("div", { className: "flex items-center gap-3 py-3 border-b border-gray-50", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base flex-shrink-0", children: info?.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: tx.merchant }), _jsxs("p", { className: "text-xs text-gray-400", children: [info?.label, " \u00B7 ", dayjs(tx.date).format('D MMM')] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: `text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`, children: [tx.type === 'income' ? '+' : '-', formatThaiCurrency(tx.amount)] }), _jsx("button", { onClick: () => deleteTransaction(tx.id), className: "text-xs text-gray-300 hover:text-red-400", children: "remove" })] })] }, tx.id));
                    })] })] }));
}
