import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/calculations';
const VAULT_COLORS = [
    { label: 'Teal', value: '#1D9E75' },
    { label: 'Blue', value: '#378ADD' },
    { label: 'Purple', value: '#7F77DD' },
    { label: 'Coral', value: '#D85A30' },
    { label: 'Amber', value: '#BA7517' },
];
const VAULT_PRESETS = [
    { name: 'Emergency fund', target: 90000, reason: 'Cover 3 months of expenses', icon: '🛡️' },
    { name: 'Car down payment', target: 150000, reason: 'Honda City / Toyota Yaris', icon: '🚗' },
    { name: 'Condo down payment', target: 500000, reason: '10% down on a condo', icon: '🏠' },
    { name: 'Japan trip', target: 80000, reason: 'Flights + hotel + spending', icon: '✈️' },
    { name: 'Wedding fund', target: 200000, reason: 'Dream wedding budget', icon: '💍' },
    { name: 'Investment seed', target: 100000, reason: 'Start investing in stocks/ETF', icon: '📈' },
];
export default function VaultPage() {
    const { vaults, addVault, depositToVault, deleteVault, updateVault } = useAppStore();
    const currency = useAppStore((s) => s.currency);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ name: '', target: '', reason: '', color: '#1D9E75', locked: true });
    const [depositMap, setDepositMap] = useState({});
    const totalVaulted = vaults.reduce((s, v) => s + v.currentAmount, 0);
    const totalTarget = vaults.reduce((s, v) => s + v.targetAmount, 0);
    const saveVault = () => {
        if (!form.name || !form.target)
            return;
        addVault({
            userId: '',
            name: form.name,
            targetAmount: Number(form.target),
            currentAmount: 0,
            color: form.color,
            locked: form.locked,
            reason: form.reason,
        });
        setForm({ name: '', target: '', reason: '', color: '#1D9E75', locked: true });
        setAdding(false);
    };
    const handleDeposit = (id) => {
        const val = Number(depositMap[id] || 0);
        if (val > 0) {
            depositToVault(id, val);
            setDepositMap((m) => ({ ...m, [id]: '' }));
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "My vaults" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "Money you don't want to touch" })] }), _jsx(Button, { className: "text-xs px-3 py-2", onClick: () => setAdding(true), children: "+ New vault" })] }), vaults.length > 0 && (_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Card, { className: "bg-gray-50 border-0", children: [_jsx("p", { className: "text-xs text-gray-400 mb-1", children: "Total vaulted" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: formatCurrency(totalVaulted, currency) })] }), _jsxs(Card, { className: "bg-gray-50 border-0", children: [_jsx("p", { className: "text-xs text-gray-400 mb-1", children: "Total target" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: formatCurrency(totalTarget, currency) })] })] })), adding && (_jsxs(Card, { children: [_jsx("h2", { className: "text-sm font-medium text-gray-700 mb-3", children: "New vault" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mb-4", children: VAULT_PRESETS.map((p) => (_jsxs("button", { onClick: () => setForm({ ...form, name: p.name, target: String(p.target), reason: p.reason }), className: `text-left p-2.5 rounded-xl border text-xs transition-all ${form.name === p.name ? 'border-brand-400 bg-brand-50' : 'border-gray-200'}`, children: [_jsx("span", { className: "text-base block mb-1", children: p.icon }), _jsx("p", { className: "font-medium text-gray-900", children: p.name }), _jsx("p", { className: "text-gray-400 mt-0.5", children: formatCurrency(p.target, currency) })] }, p.name))) }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { placeholder: "Vault name", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" }), _jsx("input", { type: "number", placeholder: `Target amount (${currency})`, value: form.target, onChange: (e) => setForm({ ...form, target: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" }), _jsx("input", { placeholder: "Why are you saving this? (optional)", value: form.reason, onChange: (e) => setForm({ ...form, reason: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-2", children: "Vault colour" }), _jsx("div", { className: "flex gap-2", children: VAULT_COLORS.map((c) => (_jsx("button", { onClick: () => setForm({ ...form, color: c.value }), style: { background: c.value }, className: `w-8 h-8 rounded-full transition-transform ${form.color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-300' : ''}` }, c.value))) })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("div", { onClick: () => setForm({ ...form, locked: !form.locked }), className: `w-10 h-6 rounded-full transition-colors relative ${form.locked ? 'bg-brand-400' : 'bg-gray-200'}`, children: _jsx("div", { className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.locked ? 'left-5' : 'left-1'}` }) }), _jsx("span", { className: "text-sm text-gray-600", children: "Lock this vault (no withdrawals reminder)" })] })] }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Button, { className: "flex-1", onClick: saveVault, children: "Create vault" }), _jsx(Button, { variant: "secondary", className: "flex-1", onClick: () => setAdding(false), children: "Cancel" })] })] })), vaults.length === 0 && !adding && (_jsxs("div", { className: "text-center py-12 text-gray-400", children: [_jsx("p", { className: "text-4xl mb-3", children: "\uD83D\uDD12" }), _jsx("p", { className: "text-sm font-medium text-gray-500", children: "No vaults yet" }), _jsx("p", { className: "text-xs mt-1", children: "Create a vault for money you don't want to touch" })] })), _jsx("div", { className: "space-y-3", children: vaults.map((v) => {
                    const pct = Math.min(100, Math.round((v.currentAmount / v.targetAmount) * 100));
                    const remaining = v.targetAmount - v.currentAmount;
                    return (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-start gap-3 mb-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold flex-shrink-0", style: { background: v.color }, children: v.name.charAt(0) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "font-medium text-gray-900 truncate", children: v.name }), v.locked && _jsx("span", { className: "text-xs", children: "\uD83D\uDD12" })] }), v.reason && _jsx("p", { className: "text-xs text-gray-400 truncate", children: v.reason })] }), _jsx("button", { onClick: () => deleteVault(v.id), className: "text-xs text-gray-300 hover:text-red-400 flex-shrink-0", children: "\u2715" })] }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mb-1.5", children: [_jsxs("span", { children: [formatCurrency(v.currentAmount, currency), " saved"] }), _jsxs("span", { children: [formatCurrency(v.targetAmount, currency), " goal"] })] }), _jsx("div", { className: "h-2 bg-gray-100 rounded-full mb-1", children: _jsx("div", { className: "h-2 rounded-full transition-all", style: { width: `${pct}%`, background: v.color } }) }), _jsxs("div", { className: "flex justify-between mb-3", children: [_jsxs("span", { className: "text-xs font-medium", style: { color: v.color }, children: [pct, "% there"] }), _jsx("span", { className: "text-xs text-gray-400", children: remaining > 0 ? `${formatCurrency(remaining, currency)} to go` : '✓ Goal reached!' })] }), !v.locked || v.currentAmount < v.targetAmount ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", placeholder: `Deposit ${currency}`, value: depositMap[v.id] || '', onChange: (e) => setDepositMap((m) => ({ ...m, [v.id]: e.target.value })), className: "flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400" }), _jsx(Button, { variant: "secondary", className: "text-xs px-3", onClick: () => handleDeposit(v.id), children: "+ Add" })] })) : (_jsx("div", { className: "bg-green-50 rounded-xl px-3 py-2 text-center", children: _jsx("p", { className: "text-xs text-green-600 font-medium", children: "\uD83C\uDF89 Vault complete!" }) }))] }, v.id));
                }) })] }));
}
