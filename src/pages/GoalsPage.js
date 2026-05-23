import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, monthsToReadable } from '@/lib/calculations';
import dayjs from 'dayjs';
const GOAL_PRESETS = [
    { name: 'Honda City', category: 'vehicle', amount: 600000 },
    { name: 'Japan trip', category: 'travel', amount: 80000 },
    { name: 'Condo down payment', category: 'property', amount: 500000 },
    { name: 'Emergency fund', category: 'emergency', amount: 90000 },
    { name: 'iPhone', category: 'gadget', amount: 35000 },
    { name: 'MacBook', category: 'gadget', amount: 65000 },
];
export default function GoalsPage() {
    const { goals, addGoal, updateGoal, user, deleteGoal } = useAppStore();
    const currency = useAppStore((s) => s.currency);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ name: '', amount: '', months: '12' });
    const monthlyFree = (user?.monthlyIncome || 0) - (user?.monthlyExpenses || 0);
    const saveGoal = () => {
        if (!form.name || !form.amount)
            return;
        addGoal({
            userId: user?.id || '',
            name: form.name,
            targetAmount: Number(form.amount),
            currentAmount: 0,
            targetDate: dayjs().add(Number(form.months), 'month').toISOString(),
            category: 'other',
            status: 'active',
        });
        setForm({ name: '', amount: '', months: '12' });
        setAdding(false);
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "My goals" }), _jsx(Button, { variant: "primary", className: "text-xs px-3 py-2", onClick: () => setAdding(true), children: "+ Add goal" })] }), adding && (_jsxs(Card, { children: [_jsx("h2", { className: "text-sm font-medium text-gray-700 mb-3", children: "New goal" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mb-3", children: GOAL_PRESETS.map((p) => (_jsxs("button", { onClick: () => setForm({ ...form, name: p.name, amount: String(p.amount) }), className: "text-left p-2 rounded-lg border border-gray-200 text-xs hover:border-brand-400 transition-colors", children: [_jsx("p", { className: "font-medium", children: p.name }), _jsx("p", { className: "text-gray-400", children: formatCurrency(p.amount, currency) })] }, p.name))) }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400", placeholder: "Goal name", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }), _jsx("input", { type: "number", className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400", placeholder: `Target amount (${currency})`, value: form.amount, onChange: (e) => setForm({ ...form, amount: e.target.value }) }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs text-gray-500", children: ["Target: ", form.months, " months"] }), _jsx("input", { type: "range", min: "1", max: "60", value: form.months, className: "w-full mt-1", onChange: (e) => setForm({ ...form, months: e.target.value }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-400", children: [_jsx("span", { children: "1 month" }), _jsx("span", { children: "5 years" })] })] }), form.amount && (_jsxs("div", { className: "bg-brand-50 rounded-xl p-3 text-sm", children: [_jsxs("p", { className: "text-brand-600 font-medium", children: ["Save ", formatCurrency(Number(form.amount) / Number(form.months), currency), "/month"] }), _jsxs("p", { className: "text-brand-400 text-xs mt-0.5", children: [Math.round(((Number(form.amount) / Number(form.months)) / Math.max(monthlyFree, 1)) * 100), "% of your free cash"] })] }))] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Button, { className: "flex-1", onClick: saveGoal, children: "Save goal" }), _jsx(Button, { variant: "secondary", className: "flex-1", onClick: () => setAdding(false), children: "Cancel" })] })] })), goals.length === 0 && !adding && (_jsxs("div", { className: "text-center py-12 text-gray-400", children: [_jsx("p", { className: "text-3xl mb-2", children: "\u25CE" }), _jsx("p", { className: "text-sm", children: "No goals yet. Add one to get started!" })] })), goals.map((g) => {
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                const monthlyNeeded = (g.targetAmount - g.currentAmount) /
                    Math.max(dayjs(g.targetDate).diff(dayjs(), 'month'), 1);
                return (_jsxs(Card, { children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: g.name }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [formatCurrency(g.currentAmount, currency), " of ", formatCurrency(g.targetAmount, currency)] })] }), _jsxs("span", { className: `text-xs px-2 py-1 rounded-full ${pct >= 100 ? 'bg-green-100 text-green-600' : 'bg-brand-50 text-brand-600'}`, children: [pct, "%"] })] }), _jsx("div", { className: "h-2 bg-gray-100 rounded-full mb-3", children: _jsx("div", { className: "h-2 bg-brand-400 rounded-full", style: { width: `${pct}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-400 mb-3", children: [_jsxs("span", { children: ["Save ", formatCurrency(monthlyNeeded, currency), "/mo to stay on track"] }), _jsxs("span", { children: [monthsToReadable(dayjs(g.targetDate).diff(dayjs(), 'month')), " left"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", placeholder: `Add savings (${currency})`, id: `add-${g.id}`, className: "flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" }), _jsx(Button, { variant: "secondary", className: "text-xs", onClick: () => {
                                        const el = document.getElementById(`add-${g.id}`);
                                        const val = Number(el.value);
                                        if (val > 0) {
                                            updateGoal(g.id, { currentAmount: g.currentAmount + val });
                                            el.value = '';
                                        }
                                    }, children: "+ Add" }), _jsx("button", { onClick: () => {
                                        if (confirm('Delete this goal? This cannot be undone.'))
                                            deleteGoal(g.id);
                                    }, className: "text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg", children: "Delete" })] })] }, g.id));
            })] }));
}
