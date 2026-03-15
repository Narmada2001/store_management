import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api/misc.api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    MdInventory2, MdWarning, MdAssignment, MdLocalShipping, MdSwapHoriz,
    MdArrowForward
} from 'react-icons/md';

const StatCard = ({ icon: Icon, label, value, color, to }) => (
    <Link to={to} className="stat-card group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="text-2xl text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-slate-400 text-xs font-medium">{label}</p>
            <p className="text-3xl font-bold text-white mt-0.5">{value ?? '—'}</p>
        </div>
        <MdArrowForward className="text-slate-600 group-hover:text-slate-400 transition-colors" />
    </Link>
);

export default function Dashboard() {
    const { user, isAdmin } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getDashboardSummary()
            .then(r => setStats(r.data.data))
            .catch(console.error);
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div>
                <h2 className="text-2xl font-bold text-white">
                    Welcome back, <span className="text-gradient">{user?.name}</span> 👋
                </h2>
                <p className="text-slate-400 text-sm mt-1">Here's the current store snapshot</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard icon={MdInventory2} label="Total Items" value={stats?.total_items} color="bg-primary-600" to="/inventory" />
                <StatCard icon={MdWarning} label="Low Stock Items" value={stats?.low_stock} color="bg-amber-500" to="/inventory?low_stock=true" />
                <StatCard icon={MdAssignment} label="Pending Requests" value={stats?.pending_requests} color="bg-purple-600" to="/requests" />
                <StatCard icon={MdLocalShipping} label="Total Suppliers" value={stats?.total_suppliers} color="bg-emerald-600" to="/suppliers" />
                <StatCard icon={MdSwapHoriz} label="Today's Transactions" value={stats?.today_transactions} color="bg-cyan-600" to="/transactions" />
            </div>

            {/* Quick Action Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card space-y-4">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                        <MdInventory2 className="text-primary-400" /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'View Inventory', to: '/inventory', color: 'bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 border-primary-500/30' },
                            { label: 'New Request', to: '/requests', color: 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border-purple-500/30' },
                            { label: 'Transactions', to: '/transactions', color: 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border-cyan-500/30' },
                            { label: 'Reports', to: '/reports', color: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30' },
                        ].map(({ label, to, color }) => (
                            <Link key={to} to={to}
                                className={`flex items-center justify-center py-3 px-4 rounded-xl border text-sm font-medium transition-all ${color}`}>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="card space-y-3">
                    <h3 className="font-semibold text-slate-200">System Info</h3>
                    {[
                        { label: 'Role', value: user?.role === 'admin' ? '👑 Admin' : '👤 Staff' },
                        { label: 'Email', value: user?.email },
                        { label: 'Database', value: 'MySQL · store_management' },
                        { label: 'Version', value: 'SMS v1.0.0' },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-700/40 last:border-0">
                            <span className="text-sm text-slate-400">{label}</span>
                            <span className="text-sm text-slate-200 font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
