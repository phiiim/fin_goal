import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
export default function Button({ variant = 'primary', children, className, ...props }) {
    return (_jsx("button", { className: clsx('rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95', variant === 'primary' && 'bg-brand-400 text-white hover:bg-brand-600', variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200', variant === 'ghost' && 'text-gray-500 hover:bg-gray-50', className), ...props, children: children }));
}
