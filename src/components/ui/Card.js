import { jsx as _jsx } from "react/jsx-runtime";
import { clsx } from 'clsx';
export default function Card({ children, className, ...props }) {
    return (_jsx("div", { className: clsx('bg-white rounded-2xl border border-gray-100 p-4', className), ...props, children: children }));
}
