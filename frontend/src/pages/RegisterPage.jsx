import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as apiRegister } from '../api/auth.api';
import { MdStorefront, MdEmail, MdLock, MdPerson, MdAdminPanelSettings, MdArrowBack } from 'react-icons/md';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('staff');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            await apiRegister({ ...form, role });
            toast.success('Registration request sent to administrators!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
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

            <div className="w-full max-w-[480px] relative z-10">
                {/* Header Branding */}
                <div className="text-center mb-8">
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full group-hover:bg-primary-500/40 transition-all duration-500" />
                        <div className="relative w-16 h-16 bg-gradient-to-tr from-primary-600 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                            <MdStorefront className="text-white text-3xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-500 mt-2 text-xs uppercase font-bold tracking-[0.2em]">Join the Store Management System</p>
                </div>

                {/* Main Auth Card */}
                <div className="relative group/card">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/5 to-cyan-500/5 rounded-[32px] blur opacity-75 transition duration-1000" />
                    
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2 group/inp">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within/inp:text-primary-400 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group/inp">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within/inp:text-primary-400 transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300"
                                        placeholder="you@store.gov"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2 group/inp">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
                                    <div className="relative">
                                        <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within/inp:text-primary-400 transition-colors" />
                                        <input
                                            type="password"
                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group/inp">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Confirm</label>
                                    <div className="relative">
                                        <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within/inp:text-primary-400 transition-colors" />
                                        <input
                                            type="password"
                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300"
                                            placeholder="••••••••"
                                            value={form.confirmPassword}
                                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="group/btn relative w-full overflow-hidden rounded-2xl mt-4 py-4 font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-50">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-500 group-hover/btn:scale-105 transition-transform duration-500" />
                                <span className="relative flex items-center justify-center gap-3">
                                    {loading ? 'Processing...' : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-all group">
                                <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
                                Return to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <span className="text-[9px] text-slate-800 font-black uppercase tracking-[0.4em]">
                    Kolonna Divisional Secretariat · Secure Registration
                </span>
            </div>
        </div>
    );
}
