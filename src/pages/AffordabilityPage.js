import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { calculateAffordability, formatThaiCurrency, monthsToReadable } from '@/lib/calculations';
const PRESETS = [
    { name: 'iPhone 16', price: 35000, icon: '📱' },
    { name: 'Honda City', price: 600000, icon: '🚗' },
    { name: 'Japan trip', price: 80000, icon: '✈️' },
    { name: 'Condo down', price: 500000, icon: '🏠' },
    { name: 'MacBook Pro', price: 65000, icon: '💻' },
    { name: 'PS5', price: 18000, icon: '🎮' },
];
export default function AffordabilityPage() {
    const user = useAppStore((s) => s.user);
    const [income, setIncome] = useState(String(user?.monthlyIncome || ''));
    const [expenses, setExpenses] = useState(String(user?.monthlyExpenses || ''));
    const [savings, setSavings] = useState(String(user?.currentSavings || ''));
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [result, setResult] = useState(null);
    const selectPreset = (name, price) => {
        setItemName(name);
        setItemPrice(String(price));
    };
    const check = () => {
        if (!income || !itemPrice)
            return;
        const r = calculateAffordability(Number(income), Number(expenses), Number(savings), Number(itemPrice), itemName);
        setResult(r);
        setTimeout(() => document.getElementById('result-top')?.scrollIntoView({ behavior: 'smooth' }), 100);
    };
    const scoreColor = result
        ? result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-amber-600' : 'text-red-500'
        : '';
    const scoreBg = result
        ? result.score >= 80 ? 'bg-green-50 border-green-200' : result.score >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
        : '';
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Can I afford it?" }), _jsxs(Card, { children: [_jsx("h2", { className: "text-sm font-medium text-gray-700 mb-3", children: "Your finances (\u0E3F/month)" }), _jsx("div", { className: "space-y-3", children: [
                            { label: 'Monthly income', val: income, set: setIncome, ph: '35,000' },
                            { label: 'Monthly expenses', val: expenses, set: setExpenses, ph: '22,000' },
                            { label: 'Current savings', val: savings, set: setSavings, ph: '50,000' },
                        ].map(({ label, val, set, ph }) => (_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-500 block mb-1", children: label }), _jsx("input", { type: "number", value: val, onChange: (e) => set(e.target.value), placeholder: ph, className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" })] }, label))) })] }), _jsxs(Card, { children: [_jsx("h2", { className: "text-sm font-medium text-gray-700 mb-3", children: "What do you want to buy?" }), _jsx("div", { className: "grid grid-cols-3 gap-2 mb-3", children: PRESETS.map((p) => (_jsxs("button", { onClick: () => selectPreset(p.name, p.price), className: `p-2 rounded-xl border text-center text-xs transition-all ${itemName === p.name ? 'border-brand-400 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`, children: [_jsx("span", { className: "block text-lg mb-0.5", children: p.icon }), _jsx("p", { className: "font-medium leading-tight", children: p.name }), _jsx("p", { className: "text-gray-400 mt-0.5", children: formatThaiCurrency(p.price) })] }, p.name))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: itemName, onChange: (e) => setItemName(e.target.value), placeholder: "Or type your own...", className: "flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" }), _jsx("input", { type: "number", value: itemPrice, onChange: (e) => setItemPrice(e.target.value), placeholder: "\u0E3F price", className: "w-28 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" })] })] }), _jsx(Button, { className: "w-full py-3", onClick: check, children: "Check affordability \u2192" }), result && (_jsxs("div", { id: "result-top", className: "space-y-4 pt-2", children: [_jsx(Card, { className: `border ${scoreBg}`, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: `w-16 h-16 rounded-2xl ${scoreBg} border flex flex-col items-center justify-center flex-shrink-0`, children: [_jsx("span", { className: `text-2xl font-semibold ${scoreColor}`, children: result.score }), _jsx("span", { className: `text-xs ${scoreColor}`, children: "/ 100" })] }), _jsxs("div", { children: [_jsxs("p", { className: `font-semibold text-base ${scoreColor}`, children: [result.label, " \u2014 ", itemName] }), _jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: result.verdict })] })] }) }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                            { label: 'Item cost', val: formatThaiCurrency(Number(itemPrice)), sub: `${result.pctOfIncome.toFixed(0)}% of monthly income` },
                            { label: 'Monthly free cash', val: formatThaiCurrency(result.monthlyFree), sub: 'after expenses' },
                            { label: 'Gap to cover', val: result.gap > 0 ? formatThaiCurrency(result.gap) : '฿0', sub: result.gap > 0 ? 'still needed' : 'already covered' },
                            { label: 'Months to goal', val: result.gap > 0 ? String(result.monthsNeeded) : '0', sub: 'saving 50% of free cash' },
                        ].map((m) => (_jsxs(Card, { className: "bg-gray-50 border-0", children: [_jsx("p", { className: "text-xs text-gray-400 mb-1", children: m.label }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: m.val }), _jsx("p", { className: "text-xs text-gray-400", children: m.sub })] }, m.label))) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 mb-2", children: "Financial impact" }), _jsx("div", { className: "space-y-2", children: result.impacts.map((imp, i) => (_jsxs(Card, { className: `border-l-2 ${imp.color === 'success' ? 'border-l-green-400' :
                                        imp.color === 'warning' ? 'border-l-amber-400' : 'border-l-red-400'}`, style: { borderRadius: '0 12px 12px 0' }, children: [_jsx("p", { className: "text-sm font-medium text-gray-900 mb-1", children: imp.title }), _jsx("p", { className: "text-xs text-gray-500 leading-relaxed", children: imp.body })] }, i))) })] }), result.gap > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 mb-2", children: "Savings timeline" }), _jsx(Card, { children: _jsx("div", { className: "space-y-3", children: result.timelineOptions.map((t) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs mb-1", children: [_jsx("span", { className: "text-gray-500", children: t.label }), _jsx("span", { className: "font-medium text-gray-900", children: monthsToReadable(t.months) })] }), _jsx("div", { className: "h-1.5 bg-gray-100 rounded-full", children: _jsx("div", { className: `h-1.5 rounded-full ${t.months <= 6 ? 'bg-green-400' : t.months <= 18 ? 'bg-amber-400' : 'bg-red-400'}`, style: { width: `${Math.max(10, 100 - (t.months / Math.max(...result.timelineOptions.map(x => x.months))) * 80)}%` } }) })] }, t.label))) }) })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 mb-2", children: "Ways to get there faster" }), _jsx("div", { className: "space-y-2", children: result.moneyTips.map((tip, i) => (_jsxs("div", { className: "flex gap-3 items-start text-sm text-gray-600", children: [_jsx("span", { className: "text-brand-400 mt-0.5 flex-shrink-0", children: "\u2192" }), _jsx("span", { children: tip })] }, i))) })] })] }))] }));
}
