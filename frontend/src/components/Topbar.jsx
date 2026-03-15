import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdLogout, MdPerson, MdKeyboardArrowDown } from 'react-icons/md';

export default function Topbar() {
    const { user, logout, isAdmin } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <header className="h-16 bg-slate-900/60 border-b border-slate-700/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm">
            <div>
                <h1 className="text-slate-200 font-semibold text-sm">
                    Government Office — Store Management System
                </h1>
            </div>

            <div className="relative">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-xl px-4 py-2 transition-colors"
                >
                    <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-slate-200 leading-none">{user?.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">{user?.role}</p>
                    </div>
                    <MdKeyboardArrowDown className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-700">
                                <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${isAdmin ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {user?.role}
                                </span>
                            </div>
                            <button
                                onClick={() => { setOpen(false); logout(); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <MdLogout /> Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
