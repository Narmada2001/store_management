import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdStorefront, MdEmail, MdArrowBack } from 'react-icons/md';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulated endpoint
            setTimeout(() => {
                setSubmitted(true);
                toast.success('Reset link sent to your email!');
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
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
                
                {/* Thin Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                {/* Header Branding */}
                <div className="text-center mb-8">
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full group-hover:bg-primary-500/40 transition-all duration-500" />
                        <div className="relative w-16 h-16 bg-gradient-to-tr from-primary-600 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                            <MdStorefront className="text-white text-3xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Recover Account</h1>
                    <p className="text-slate-500 mt-2 text-xs uppercase font-bold tracking-[0.2em]">Password Reset Terminal</p>
                </div>

                {/* Main Auth Card */}
                <div className="relative group/card">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/5 to-cyan-500/5 rounded-[32px] blur opacity-75 transition duration-1000" />
                    
                    <div className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[30px] p-8 sm:p-10">
                        {!submitted ? (
                            <>
                                <p className="text-slate-400 text-sm mb-8 text-center leading-relaxed">
                                    Enter your registered email address and we'll send you a secure link to reset your password.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2 group/inp">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within/inp:text-primary-400 transition-colors" />
                                            <input
                                                type="email"
                                                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all duration-300"
                                                placeholder="you@store.gov"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button type="submit" disabled={loading}
                                            className="group/btn relative w-full overflow-hidden rounded-2xl py-4 font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-50">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-cyan-500 group-hover/btn:scale-105 transition-transform duration-500" />
                                            <span className="relative flex items-center justify-center gap-3">
                                                {loading ? 'Sending...' : 'Send Recovery Link'}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                                    <div className="relative w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl border border-emerald-500/20">
                                        <MdEmail size={40} />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Transmission Successful</h2>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    A recovery link has been dispatched to <span className="text-slate-200 font-bold underline decoration-emerald-500/30">{email}</span>. Please check your inbox.
                                </p>
                                <button onClick={() => setSubmitted(false)} className="text-primary-400 text-xs font-black uppercase tracking-widest hover:text-primary-300 transition-all border-b border-primary-500/30 hover:border-primary-500 pb-1">
                                    Try Alternative Identity
                                </button>
                            </div>
                        )}

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all group">
                                <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
                                Back to Terminal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <span className="text-[9px] text-slate-800 font-black uppercase tracking-[0.4em]">
                    Kolonna Divisional Secretariat · Recovery Protocol
                </span>
            </div>
        </div>
    );
}
