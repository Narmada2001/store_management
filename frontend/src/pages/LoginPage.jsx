import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdStorefront, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdPerson, MdAdminPanelSettings } from 'react-icons/md';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('admin'); // 'admin' or 'staff'
    const [form, setForm] = useState({ email: 'admin@store.gov', password: 'Admin@123' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    // Update credentials when role changes (convenience for the user)
    useEffect(() => {
        if (role === 'admin') {
            setForm({ email: 'admin@store.gov', password: 'Admin@123' });
        } else {
            setForm({ email: 'staff@store.gov', password: 'Staff@123' });
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success(`Welcome back, ${role}!`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed Check credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.05) 0%, transparent 40%)' }}>
            
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/40 glow transform transition-transform hover:scale-105 duration-300">
                        <MdStorefront className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Store Management</h1>
                    <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide uppercase">Kolonna Divisional Secretariat</p>
                </div>

                {/* Form Card */}
                <div className="card shadow-2xl border border-slate-800/50 backdrop-blur-xl bg-slate-900/80 p-6 sm:p-8">
                    
                    {/* Role Selector Tabs */}
                    <div className="flex p-1 bg-slate-800/50 rounded-xl mb-8 border border-slate-700/30">
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                role === 'admin' 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                        >
                            <MdAdminPanelSettings className="text-lg" />
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('staff')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                role === 'staff' 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                        >
                            <MdPerson className="text-lg" />
                            Staff
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    className="inp pl-10 focus:ring-2 focus:ring-primary-500/20 border-slate-700/50 bg-slate-800/40"
                                    placeholder={role === 'admin' ? "admin@store.gov" : "staff@store.gov"}
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Password</label>
                            <div className="relative">
                                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    className="inp pl-10 pr-11 focus:ring-2 focus:ring-primary-500/20 border-slate-700/50 bg-slate-800/40"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors">
                                    {showPwd ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={loading}
                                className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-xl shadow-primary-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Signing into {role}...
                                    </span>
                                ) : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Default: <span className="text-primary-400 font-mono tracking-normal lowercase">{role === 'admin' ? 'admin@store.gov' : 'staff@store.gov'}</span> / <span className="text-primary-400 font-mono tracking-normal">{role === 'admin' ? 'Admin@123' : 'Staff@123'}</span>
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-between px-2">
                    <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                        Secure SSL Encryption
                    </p>
                    <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                        Session: 8 Hours
                    </p>
                </div>
            </div>
            
            {/* Bottom Footer Decor */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-700 text-[10px] font-medium tracking-tight">
                © {new Date().getFullYear()} KOLONNA DIVISIONAL SECRETARIAT · ALL RIGHTS RESERVED
            </div>
        </div>
    );
}

