import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
const mainNav = [
    { to: '/', label: 'Home', icon: '⊞' },
    { to: '/goals', label: 'Goals', icon: '◎' },
    { to: '/check', label: 'Afford?', icon: '✓' },
    { to: '/transactions', label: 'Spending', icon: '↕' },
    { to: '/more', label: 'More', icon: '⋯' },
];
const moreNav = [
    { to: '/vault', label: 'Vault', icon: '🔒', desc: 'Money you don\'t touch' },
    { to: '/calculator', label: 'Goal calculator', icon: '🧮', desc: 'How much to save per month' },
    { to: '/retirement', label: 'Retirement plan', icon: '🏖️', desc: 'Plan your future today' },
];
export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const users = useAppStore((s) => s.users);
    const logout = useAppStore((s) => s.logout);
    const deleteUser = useAppStore((s) => s.deleteUser);
    const [showMore, setShowMore] = useState(false);
    const isMorePage = moreNav.some(n => location.pathname === n.to);
    return (_jsxs("div", { className: "min-h-screen flex flex-col max-w-md mx-auto bg-white", children: [_jsx("main", { className: "flex-1 overflow-auto pb-20 px-4 pt-6", children: children }), showMore && (_jsxs("div", { className: "fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 space-y-1 z-10", children: [_jsxs("div", { className: "mb-3 rounded-2xl border border-gray-100 bg-gray-50 p-3", children: [_jsx("p", { className: "text-xs text-gray-400", children: "Active profile" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: user?.name || 'No profile' }), _jsxs("div", { className: "mt-2 flex items-center justify-between gap-2", children: [_jsxs("p", { className: "text-xs text-gray-400", children: [users.length, " saved profile", users.length === 1 ? '' : 's'] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => {
                                                    setShowMore(false);
                                                    navigate('/onboarding');
                                                }, className: "text-xs font-medium text-brand-500", children: "Manage users" }), _jsx("button", { onClick: () => {
                                                    logout();
                                                    setShowMore(false);
                                                    navigate('/onboarding');
                                                }, className: "text-xs font-medium text-red-500", children: "Log out" }), user && (_jsx("button", { onClick: () => {
                                                    if (!window.confirm(`Delete profile \"${user.name}\"? This cannot be undone.`))
                                                        return;
                                                    deleteUser(user.id);
                                                    setShowMore(false);
                                                    navigate('/onboarding');
                                                }, className: "text-xs font-medium text-red-600", children: "Delete active profile" }))] })] })] }), moreNav.map((n) => (_jsxs(NavLink, { to: n.to, onClick: () => setShowMore(false), className: "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors", children: [_jsx("span", { className: "text-xl w-8 text-center", children: n.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: n.label }), _jsx("p", { className: "text-xs text-gray-400", children: n.desc })] })] }, n.to)))] })), showMore && _jsx("div", { className: "fixed inset-0 z-0", onClick: () => setShowMore(false) }), _jsx("nav", { className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-20", children: _jsx("div", { className: "grid grid-cols-5", children: mainNav.map((n) => {
                        const active = n.to === '/more' ? isMorePage || showMore : location.pathname === n.to;
                        return n.to === '/more' ? (_jsxs("button", { onClick: () => setShowMore(!showMore), className: `flex flex-col items-center py-3 text-xs gap-1 transition-colors ${active ? 'text-brand-400 font-medium' : 'text-gray-400'}`, children: [_jsx("span", { className: "text-lg leading-none", children: n.icon }), n.label] }, "more")) : (_jsxs(NavLink, { to: n.to, end: n.to === '/', className: ({ isActive }) => `flex flex-col items-center py-3 text-xs gap-1 transition-colors ${isActive ? 'text-brand-400 font-medium' : 'text-gray-400'}`, children: [_jsx("span", { className: "text-lg leading-none", children: n.icon }), n.label] }, n.to));
                    }) }) })] }));
}
