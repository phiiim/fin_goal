import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import Button from '@/components/ui/Button';
import dayjs from 'dayjs';
import { formatCurrency } from '@/lib/calculations';
export default function OnboardingPage() {
    const navigate = useNavigate();
    const users = useAppStore((s) => s.users);
    const user = useAppStore((s) => s.user);
    const setUser = useAppStore((s) => s.setUser);
    const switchUser = useAppStore((s) => s.switchUser);
    const deleteUser = useAppStore((s) => s.deleteUser);
    const currency = useAppStore((s) => s.currency);
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ name: '', income: '', expenses: '', savings: '' });
    const setCurrency = useAppStore((s) => s.setCurrency);
    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const finish = () => {
        setUser({
            id: crypto.randomUUID(),
            name: form.name || 'Friend',
            monthlyIncome: Number(form.income),
            monthlyExpenses: Number(form.expenses),
            currentSavings: Number(form.savings),
            createdAt: dayjs().toISOString(),
            currency,
        });
        navigate('/');
    };
    const steps = [
        {
            title: "Hello! 👋",
            subtitle: "FinGoal helps you reach your financial goals",
            content: (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "Your name" }), _jsx("input", { className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400", placeholder: "e.g. Ploy", value: form.name, onChange: (e) => update('name', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: "Currency" }), _jsxs("select", { className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm", value: currency, onChange: (e) => setCurrency(e.target.value), children: [_jsx("option", { value: "THB", children: "Thai Baht (THB)" }), _jsx("option", { value: "USD", children: "US Dollar (USD)" }), _jsx("option", { value: "EUR", children: "Euro (EUR)" }), _jsx("option", { value: "JPY", children: "Japanese Yen (JPY)" })] })] })] })),
            canNext: true,
        },
        {
            title: "Your income & expenses",
            subtitle: "We'll use this to calculate your saving power",
            content: (_jsx("div", { className: "space-y-4", children: [
                    { key: 'income', label: `Monthly income (${currency})`, placeholder: '35,000' },
                    { key: 'expenses', label: `Monthly expenses (${currency})`, placeholder: '22,000' },
                ].map(({ key, label, placeholder }) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-500 mb-1", children: label }), _jsx("input", { type: "number", className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400", placeholder: placeholder, value: form[key], onChange: (e) => update(key, e.target.value) })] }, key))) })),
            canNext: !!form.income && !!form.expenses,
        },
        {
            title: "Current savings",
            subtitle: "How much do you have saved right now?",
            content: (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm text-gray-500 mb-1", children: ["Total savings (", currency, ")"] }), _jsx("input", { type: "number", className: "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400", placeholder: "50,000", value: form.savings, onChange: (e) => update('savings', e.target.value) }), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: "Include all bank accounts, piggy banks, everything." })] })),
            canNext: !!form.savings,
        },
    ];
    const s = steps[step];
    return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white px-6", children: _jsxs("div", { className: "w-full max-w-sm", children: [users.length > 0 && (_jsxs("div", { className: "mb-6 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-gray-400", children: "Saved profiles" }), _jsx("div", { className: "mt-3 space-y-2", children: users.map((profile) => (_jsxs("div", { className: `w-full rounded-xl border px-3 py-3 transition-colors ${user?.id === profile.id ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white hover:border-gray-300'}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: profile.name }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Income ", formatCurrency(profile.monthlyIncome, profile.currency ?? 'THB')] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [user?.id === profile.id && _jsx("span", { className: "text-xs font-medium text-brand-500", children: "Active" }), _jsx("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            if (!window.confirm(`Delete profile \"${profile.name}\"? This cannot be undone.`))
                                                                return;
                                                            deleteUser(profile.id);
                                                        }, className: "text-xs font-medium text-red-500", children: "Delete" })] })] }), _jsx("button", { onClick: () => {
                                            switchUser(profile.id);
                                            navigate('/');
                                        }, className: "mt-2 text-xs font-medium text-brand-500", children: "Switch to this profile" })] }, profile.id))) }), _jsx("p", { className: "text-xs text-gray-400 mt-3", children: "Switch profiles above or create a fresh one below." })] })), _jsx("div", { className: "flex gap-1 mb-8", children: steps.map((_, i) => (_jsx("div", { className: `h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-400' : 'bg-gray-200'}` }, i))) }), _jsx("h1", { className: "text-2xl font-semibold text-gray-900 mb-1", children: s.title }), _jsx("p", { className: "text-sm text-gray-500 mb-8", children: s.subtitle }), s.content, _jsxs("div", { className: "mt-8", children: [step < steps.length - 1 ? (_jsx(Button, { className: "w-full", disabled: !s.canNext, onClick: () => setStep(step + 1), children: "Continue \u2192" })) : (_jsx(Button, { className: "w-full", disabled: !s.canNext, onClick: finish, children: "Let's go! \uD83D\uDE80" })), step > 0 && (_jsx("button", { className: "w-full text-sm text-gray-400 mt-3", onClick: () => setStep(step - 1), children: "Back" }))] })] }) }));
}
