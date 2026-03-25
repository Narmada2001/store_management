import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdStorefront, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdPerson, MdAdminPanelSettings, MdInfoOutline } from 'react-icons/md';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('admin');
    const [form, setForm] = useState({ email: 'admin@store.gov', password: 'Admin@123' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden font-sans selection:bg-primary-500/30">
            {/* Ultra-Premium Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full" />
                
                {/* Thin Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                {/* Header Branding */}
                <div className="text-center mb-10">
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full group-hover:bg-primary-500/40 transition-all duration-500" />
                        <div className="relative w-20 h-20 bg-gradient-to-tr from-primary-600 to-cyan-400 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-2xl transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                            <MdStorefront className="text-white text-4xl" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">Management</span>
                    </h1>
                    <div className="mt-2 flex items-center justify-center gap-2">
                        <div className="h-[1px] w-6 bg-slate-800" />
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">Kolonna Divisional Secretariat</span>
                        <div className="h-[1px] w-6 bg-slate-800" />
                    </div>
                </div>

                {/* Main Auth Card */}
                <div className="relative group/card">
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/5 to-cyan-500/5 rounded-[32px] blur opacity-75 group-hover/card:opacity-100 transition duration-1000 group-hover/card:duration-200" />
                    
                    <div className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[30px] p-8 sm:p-10">
                        {/* Elegant Role Tabs */}
                        <div className="flex p-1.5 bg-slate-950/40 rounded-2xl mb-8 border border-white/5">
                            {['admin', 'staff'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex-1 flex items-center justify-center gap-2.5 py-3 text-sm font-bold rounded-xl transition-all duration-500 ${
                                        role === r 
                                        ? 'bg-slate-800 text-white shadow-xl border border-white/10' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {r === 'admin' ? <MdAdminPanelSettings className="text-lg" /> : <MdPerson className="text-lg" />}
                                    <span className="capitalize">{r}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Identity Access</label>
                                <div className="relative group/inp">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <MdEmail className="text-slate-500 text-xl group-focus-within/inp:text-primary-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300"
                                        placeholder="Identification Email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Security Key</label>
                                    <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-primary-400/80 hover:text-primary-300 transition-colors uppercase tracking-wider">
                                        Forgot Key?
                                    </Link>
                                </div>
                                <div className="relative group/inp">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <MdLock className="text-slate-500 text-xl group-focus-within/inp:text-primary-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPwd ? 'text' : 'password'}
                                        className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPwd(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
                                        {showPwd ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="group/btn relative w-full overflow-hidden rounded-2xl py-4 font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-primary-500/10">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-500 group-hover/btn:scale-105 transition-transform duration-500" />
                                <span className="relative flex items-center justify-center gap-3">
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                    ) : (
                                        <>Access Terminal <span className="hidden sm:inline-block">as {role}</span></>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Secondary Actions */}
                        <div className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col items-center gap-4">
                            <p className="text-sm text-slate-500 font-medium">
                                No access credentials? {' '}
                                <Link to="/register" className="text-white hover:text-primary-400 font-bold transition-all underline underline-offset-8 decoration-primary-500/30 hover:decoration-primary-500">
                                    Register Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Info & Footer */}
                <div className="mt-10 flex flex-col items-center gap-6">
                    {/* Discreet Default Credentials Info */}
                    <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all cursor-help group/info border border-white/5">
                        <MdInfoOutline className="text-slate-500 group-hover/info:text-primary-400" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Demo Access: <span className="text-slate-300 lowercase font-medium tracking-normal">{role === 'admin' ? 'admin@store.gov' : 'staff@store.gov'}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-8 justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">Server Live</span>
                        </div>
                        <div className="h-4 w-[1px] bg-slate-800" />
                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest text-center leading-none">
                            SSL Protected<br/>System v1.0
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Minimal Footer */}
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <span className="text-[9px] text-slate-800 font-black uppercase tracking-[0.4em]">
                    Kolonna Divisional Secretariat · Secure Environment
                </span>
            </div>
        </div>
    );
}

