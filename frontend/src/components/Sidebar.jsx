import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    MdDashboard, MdInventory2, MdAssignment, MdSwapHoriz,
    MdLocalShipping, MdPeople, MdBarChart, MdStorefront
} from 'react-icons/md';

const navItems = [
    { to: '/', icon: MdDashboard, label: 'Dashboard', exact: true },
    { to: '/inventory', icon: MdInventory2, label: 'Inventory' },
    { to: '/requests', icon: MdAssignment, label: 'Requests' },
    { to: '/transactions', icon: MdSwapHoriz, label: 'Transactions' },
    { to: '/suppliers', icon: MdLocalShipping, label: 'Suppliers', admin: true },
    { to: '/users', icon: MdPeople, label: 'Users', admin: true },
    { to: '/reports', icon: MdBarChart, label: 'Reports' },
];

export default function Sidebar() {
    const { isAdmin } = useAuth();

    return (
        <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <MdStorefront className="text-white text-lg" />
                </div>
                <div>
                    <p className="text-sm font-bold text-white leading-tight">Store Management</p>
                    <p className="text-xs text-slate-400">Government Office</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label, admin, exact }) => {
                    if (admin && !isAdmin) return null;
                    return (
                        <NavLink
                            key={to}
                            to={to}
                            end={exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`
                            }
                        >
                            <Icon className="text-lg shrink-0" />
                            {label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-600 text-center">SMS v1.0 · 2026</p>
            </div>
        </aside>
    );
}
