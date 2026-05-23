import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import { formatThaiCurrency } from '@/lib/calculations';
import { useNavigate } from 'react-router-dom';
export default function DashboardPage() {
    const { user, goals, getMonthlySpend, updateUser } = useAppStore();
    const navigate = useNavigate();
    const monthlySpend = getMonthlySpend();
    const monthlyFree = (user?.monthlyIncome || 0) - (user?.monthlyExpenses || 0);
    const activeGoals = goals.filter((g) => g.status === 'active');
    const [editing, setEditing] = useState(null);
    const [value, setValue] = useState('');
    const startEdit = (field) => {
        setEditing(field);
        if (field === 'income')
            setValue(String(user?.monthlyIncome ?? ''));
        if (field === 'expenses')
            setValue(String(user?.monthlyExpenses ?? ''));
        if (field === 'savings')
            setValue(String(user?.currentSavings ?? ''));
    };
    const cancelEdit = () => {
        setEditing(null);
        setValue('');
    };
    const saveEdit = () => {
        if (!user)
            return;
        const num = Number(value) || 0;
        if (editing === 'income')
            updateUser({ monthlyIncome: num });
        if (editing === 'expenses')
            updateUser({ monthlyExpenses: num });
        if (editing === 'savings')
            updateUser({ currentSavings: num });
        cancelEdit();
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Good day," }), _jsxs("h1", { className: "text-2xl font-semibold text-gray-900", children: [user?.name, " \uD83D\uDC4B"] })] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                    { key: 'income', label: 'Monthly income', value: formatThaiCurrency(user?.monthlyIncome || 0), sub: 'per month' },
                    { key: 'expenses', label: 'Free cash', value: formatThaiCurrency(monthlyFree), sub: 'after expenses', ok: monthlyFree > 0 },
                    { key: 'savings', label: 'Savings', value: formatThaiCurrency(user?.currentSavings || 0), sub: 'total saved' },
                    { key: 'spent', label: 'Spent this month', value: formatThaiCurrency(monthlySpend), sub: 'tracked' },
                ].map((m) => (_jsx(Card, { className: "bg-gray-50 border-0", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400 mb-1", children: m.label }), editing === 'income' && m.key === 'income' ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: "w-32 border rounded px-2 py-1 text-sm", type: "number", value: value, onChange: (e) => setValue(e.target.value) }), _jsx("button", { className: "text-xs text-brand-600", onClick: saveEdit, children: "Save" }), _jsx("button", { className: "text-xs text-gray-400", onClick: cancelEdit, children: "Cancel" })] })) : editing === 'expenses' && m.key === 'expenses' ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: "w-32 border rounded px-2 py-1 text-sm", type: "number", value: value, onChange: (e) => setValue(e.target.value) }), _jsx("button", { className: "text-xs text-brand-600", onClick: saveEdit, children: "Save" }), _jsx("button", { className: "text-xs text-gray-400", onClick: cancelEdit, children: "Cancel" })] })) : editing === 'savings' && m.key === 'savings' ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: "w-32 border rounded px-2 py-1 text-sm", type: "number", value: value, onChange: (e) => setValue(e.target.value) }), _jsx("button", { className: "text-xs text-brand-600", onClick: saveEdit, children: "Save" }), _jsx("button", { className: "text-xs text-gray-400", onClick: cancelEdit, children: "Cancel" })] })) : (_jsx(_Fragment, { children: _jsxs("button", { onClick: () => {
                                                if (m.key === 'income')
                                                    startEdit('income');
                                                if (m.key === 'expenses')
                                                    startEdit('expenses');
                                                if (m.key === 'savings')
                                                    startEdit('savings');
                                            }, className: `text-left cursor-pointer`, children: [_jsx("p", { className: `text-lg font-semibold ${m.ok === false ? 'text-red-500' : 'text-gray-900'}`, children: m.value }), _jsx("p", { className: "text-xs text-gray-400", children: m.sub })] }) }))] }), _jsx("div", {})] }) }, m.label))) }), activeGoals.length > 0 && (_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-medium text-gray-700 mb-2", children: "Active goals" }), _jsx("div", { className: "space-y-3", children: activeGoals.slice(0, 3).map((g) => {
                            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                            return (_jsxs(Card, { className: "cursor-pointer hover:border-brand-100", onClick: () => navigate('/goals'), children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: g.name }), _jsxs("p", { className: "text-xs text-gray-400", children: [pct, "%"] })] }), _jsx("div", { className: "h-1.5 bg-gray-100 rounded-full", children: _jsx("div", { className: "h-1.5 bg-brand-400 rounded-full transition-all", style: { width: `${pct}%` } }) }), _jsxs("div", { className: "flex justify-between mt-1", children: [_jsx("p", { className: "text-xs text-gray-400", children: formatThaiCurrency(g.currentAmount) }), _jsx("p", { className: "text-xs text-gray-400", children: formatThaiCurrency(g.targetAmount) })] })] }, g.id));
                        }) })] })), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Card, { className: "border-brand-100 bg-brand-50 cursor-pointer", onClick: () => navigate('/check'), children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\u2713" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-brand-600", children: "Can I afford it?" }), _jsx("p", { className: "text-xs text-brand-400", children: "Quick check" })] })] }) }), _jsx(Card, { className: "border-purple-100 bg-purple-50 cursor-pointer", onClick: () => navigate('/calculator'), children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83E\uDDEE" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-purple-700", children: "How much to save?" }), _jsx("p", { className: "text-xs text-purple-400", children: "Monthly planner" })] })] }) }), _jsx(Card, { className: "border-amber-100 bg-amber-50 cursor-pointer", onClick: () => navigate('/vault'), children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83D\uDD12" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-amber-700", children: "My vaults" }), _jsx("p", { className: "text-xs text-amber-400", children: "Locked savings" })] })] }) }), _jsx(Card, { className: "border-blue-100 bg-blue-50 cursor-pointer", onClick: () => navigate('/retirement'), children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83C\uDFD6\uFE0F" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-blue-700", children: "Retirement" }), _jsx("p", { className: "text-xs text-blue-400", children: "Plan your future" })] })] }) })] })] }));
}
