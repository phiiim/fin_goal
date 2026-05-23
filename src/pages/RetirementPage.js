import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/calculations';
function calcRetirement(currentAge, retirementAge, monthlyExpense, currentSaved, returnRate) {
    const yearsToRetire = retirementAge - currentAge;
    const lifeExpectancy = 85;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    const totalNeeded = monthlyExpense * 12 * yearsInRetirement;
    const monthlyRate = returnRate / 100 / 12;
    const months = yearsToRetire * 12;
    // future value of current savings
    const fvCurrent = currentSaved * Math.pow(1 + monthlyRate, months);
    const gap = Math.max(0, totalNeeded - fvCurrent);
    // monthly saving needed (PMT formula)
    let monthlySavingNeeded = 0;
    if (monthlyRate > 0 && gap > 0) {
        monthlySavingNeeded = gap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    }
    else if (gap > 0) {
        monthlySavingNeeded = gap / months;
    }
    // early start impact — if started 5 years earlier
    const monthsEarly = (yearsToRetire + 5) * 12;
    const fvEarly = currentSaved * Math.pow(1 + monthlyRate, monthsEarly);
    const gapEarly = Math.max(0, totalNeeded - fvEarly);
    let monthlyEarly = 0;
    if (monthlyRate > 0 && gapEarly > 0) {
        monthlyEarly = gapEarly * monthlyRate / (Math.pow(1 + monthlyRate, monthsEarly) - 1);
    }
    else if (gapEarly > 0) {
        monthlyEarly = gapEarly / monthsEarly;
    }
    return {
        yearsToRetire,
        yearsInRetirement,
        totalNeeded,
        fvCurrent,
        gap,
        monthlySavingNeeded: Math.ceil(monthlySavingNeeded),
        monthlyEarly: Math.ceil(monthlyEarly),
        earlySaving: Math.ceil(monthlySavingNeeded - monthlyEarly),
    };
}
export default function RetirementPage() {
    const { user, retirementPlan, setRetirementPlan } = useAppStore();
    const currency = useAppStore((s) => s.currency);
    const [form, setForm] = useState({
        currentAge: String(retirementPlan?.currentAge || 25),
        retirementAge: String(retirementPlan?.retirementAge || 60),
        monthlyExpense: String(retirementPlan?.monthlyExpenseAtRetirement || user?.monthlyExpenses || ''),
        currentSaved: String(retirementPlan?.currentRetirementSavings || 0),
        returnRate: String(retirementPlan?.expectedReturnRate || 5),
    });
    const [result, setResult] = useState(retirementPlan ? calcRetirement(retirementPlan.currentAge, retirementPlan.retirementAge, retirementPlan.monthlyExpenseAtRetirement, retirementPlan.currentRetirementSavings, retirementPlan.expectedReturnRate) : null);
    const calculate = () => {
        const plan = {
            currentAge: Number(form.currentAge),
            retirementAge: Number(form.retirementAge),
            monthlyExpenseAtRetirement: Number(form.monthlyExpense),
            currentRetirementSavings: Number(form.currentSaved),
            expectedReturnRate: Number(form.returnRate),
        };
        setRetirementPlan(plan);
        setResult(calcRetirement(plan.currentAge, plan.retirementAge, plan.monthlyExpenseAtRetirement, plan.currentRetirementSavings, plan.expectedReturnRate));
    };
    const urgencyColor = result
        ? result.monthlySavingNeeded < (user?.monthlyExpenses || 30000) * 0.15 ? 'text-green-600'
            : result.monthlySavingNeeded < (user?.monthlyExpenses || 30000) * 0.3 ? 'text-amber-600'
                : 'text-red-500'
        : '';
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Retirement planner" }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: "How much do you need to save today?" })] }), _jsxs(Card, { children: [_jsx("h2", { className: "text-sm font-medium text-gray-700 mb-4", children: "Your details" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-500 block mb-1", children: "Current age" }), _jsx("input", { type: "number", value: form.currentAge, onChange: (e) => setForm({ ...form, currentAge: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-500 block mb-1", children: "Retire at age" }), _jsx("input", { type: "number", value: form.retirementAge, onChange: (e) => setForm({ ...form, retirementAge: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs text-gray-500 block mb-1", children: ["Monthly expenses at retirement (", currency, ")"] }), _jsx("input", { type: "number", value: form.monthlyExpense, placeholder: "e.g. 30,000", onChange: (e) => setForm({ ...form, monthlyExpense: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "How much per month do you want to live on after retiring?" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs text-gray-500 block mb-1", children: ["Current retirement savings (", currency, ")"] }), _jsx("input", { type: "number", value: form.currentSaved, placeholder: "0", onChange: (e) => setForm({ ...form, currentSaved: e.target.value }), className: "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("label", { className: "text-xs text-gray-500", children: "Expected return rate" }), _jsxs("span", { className: "text-xs font-medium text-brand-400", children: [form.returnRate, "% per year"] })] }), _jsx("input", { type: "range", min: "1", max: "12", step: "0.5", value: form.returnRate, onChange: (e) => setForm({ ...form, returnRate: e.target.value }), className: "w-full" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-400 mt-1", children: [_jsx("span", { children: "1% (fixed deposit)" }), _jsx("span", { children: "7\u20138% (index fund)" }), _jsx("span", { children: "12% (aggressive)" })] })] })] }), _jsx(Button, { className: "w-full mt-4", onClick: calculate, children: "Calculate my plan" })] }), result && (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { className: "border-2 border-gray-100", children: [_jsx("p", { className: "text-xs text-gray-400 mb-1", children: "You need to save per month" }), _jsx("p", { className: `text-3xl font-semibold ${urgencyColor}`, children: formatCurrency(result.monthlySavingNeeded, currency) }), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Starting now, for ", result.yearsToRetire, " years at ", form.returnRate, "% return"] })] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                            { label: 'Total you\'ll need', val: formatCurrency(result.totalNeeded, currency), sub: `For ${result.yearsInRetirement} yrs retirement` },
                            { label: 'Your savings grow to', val: formatCurrency(result.fvCurrent, currency), sub: 'From current savings' },
                            { label: 'Gap to fill', val: formatCurrency(result.gap, currency), sub: 'Via monthly savings' },
                            { label: 'Years to save', val: String(result.yearsToRetire), sub: 'Until retirement' },
                        ].map((m) => (_jsxs(Card, { className: "bg-gray-50 border-0", children: [_jsx("p", { className: "text-xs text-gray-400 mb-1", children: m.label }), _jsx("p", { className: "text-base font-semibold text-gray-900", children: m.val }), _jsx("p", { className: "text-xs text-gray-400", children: m.sub })] }, m.label))) }), result.earlySaving > 0 && (_jsxs(Card, { className: "bg-amber-50 border-amber-100", children: [_jsx("p", { className: "text-sm font-medium text-amber-800 mb-1", children: "\u23F0 The cost of waiting" }), _jsxs("p", { className: "text-xs text-amber-700 leading-relaxed", children: ["If you had started 5 years earlier, you'd only need to save", ' ', _jsxs("span", { className: "font-semibold", children: [formatCurrency(result.monthlyEarly, currency), "/month"] }), " instead. Every year you wait costs you ", _jsxs("span", { className: "font-semibold", children: [formatCurrency(result.earlySaving * 12, currency), "/year"] }), " more in contributions."] })] })), _jsxs(Card, { children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-3", children: "What to invest in (Thailand)" }), _jsx("div", { className: "space-y-3", children: [
                                    { name: 'SSF / RMF', desc: 'Tax-deductible retirement funds — first option for Thai residents', return: '5–8%', risk: 'Low–Med', tag: '🇹🇭' },
                                    { name: 'SET index ETF', desc: 'TDEX, ETONSET — track Thai stock market automatically', return: '7–10%', risk: 'Medium', tag: '📈' },
                                    { name: 'Fixed deposit', desc: 'Kasikorn, SCB 12-month FD — safe but low return', return: '1.5–2.5%', risk: 'Very low', tag: '🏦' },
                                    { name: 'US ETF (via Jitta)', desc: 'S&P500 via Thai brokers — best long-term growth', return: '8–12%', risk: 'Med–High', tag: '🌍' },
                                ].map((inv) => (_jsxs("div", { className: "flex items-start gap-3 py-2 border-b border-gray-50 last:border-0", children: [_jsx("span", { className: "text-lg mt-0.5", children: inv.tag }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: inv.name }), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: inv.desc })] }), _jsxs("div", { className: "text-right flex-shrink-0", children: [_jsx("p", { className: "text-xs font-medium text-brand-400", children: inv.return }), _jsx("p", { className: "text-xs text-gray-400", children: inv.risk })] })] }, inv.name))) })] })] }))] }));
}
