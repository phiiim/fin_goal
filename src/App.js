import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/ui/Layout';
import OnboardingPage from '@/pages/OnboardingPage';
import DashboardPage from '@/pages/DashboardPage';
import GoalsPage from '@/pages/GoalsPage';
import AffordabilityPage from '@/pages/AffordabilityPage';
import TransactionsPage from '@/pages/TransactionsPage';
import VaultPage from '@/pages/VaultPage';
import RetirementPage from '@/pages/RetirementPage';
import GoalCalculatorPage from '@/pages/GoalCalculatorPage';
export default function App() {
    const user = useAppStore((s) => s.user);
    const location = useLocation();
    if (location.pathname === '/onboarding')
        return _jsx(OnboardingPage, {});
    if (!user)
        return _jsx(OnboardingPage, {});
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/goals", element: _jsx(GoalsPage, {}) }), _jsx(Route, { path: "/check", element: _jsx(AffordabilityPage, {}) }), _jsx(Route, { path: "/transactions", element: _jsx(TransactionsPage, {}) }), _jsx(Route, { path: "/vault", element: _jsx(VaultPage, {}) }), _jsx(Route, { path: "/retirement", element: _jsx(RetirementPage, {}) }), _jsx(Route, { path: "/calculator", element: _jsx(GoalCalculatorPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }) }));
}
