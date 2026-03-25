import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdStorefront, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Login successful');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4"
            style={{ backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%)' }}>
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30 glow">
                        <MdStorefront className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Store Management</h1>
                    <p className="text-slate-400 mt-1.5 text-sm font-medium tracking-wide">Kolonna Divisional Secretariat</p>
                </div>

                {/* Form Card */}
                <div className="card shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                                <input
                                    type="email"
                                    className="inp pl-10"
                                    placeholder="you@store.gov"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    className="inp pl-10 pr-11"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                    {showPwd ? <MdVisibilityOff /> : <MdVisibility />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-xs text-slate-500">
                        Default: <span className="text-slate-400 font-mono">admin@store.gov</span> / <span className="text-slate-400 font-mono">Admin@123</span>
                    </p>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Secure login · All sessions expire after 8 hours
                </p>
            </div>
        </div>
    );
}
