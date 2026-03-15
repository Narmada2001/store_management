import { useEffect, useState, useCallback } from 'react';
import { getUsers, updateUser, deleteUser, resetPassword } from '../api/misc.api';
import { register } from '../api/auth.api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdPersonOff, MdSearch, MdPeople, MdLockReset } from 'react-icons/md';

const ROLE_CLASS = { admin: 'bg-primary-500/20 text-primary-400 border-primary-500/30', staff: 'bg-slate-700/60 text-slate-400 border-slate-600/50' };

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', role: 'staff', is_active: 1 });
    const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'staff' });
    const [resetForm, setResetForm] = useState({ newPassword: '' });
    const [resetTarget, setResetTarget] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        try { const res = await getUsers(); setUsers(res.data.data); }
        catch { toast.error('Failed to load users'); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const openEdit = (u) => {
        setForm({ name: u.name, email: u.email, role: u.role, is_active: u.is_active });
        setEditUser(u); setModal('edit');
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await updateUser(editUser.id, form);
            toast.success('User updated');
            fetchAll(); setModal(null);
        } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await register(regForm);
            toast.success('User registered successfully');
            fetchAll(); setModal(null);
            setRegForm({ name: '', email: '', password: '', role: 'staff' });
        } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
        setLoading(false);
    };

    const handleDeactivate = async (u) => {
        if (!confirm(`Deactivate user "${u.name}"?`)) return;
        try { await deleteUser(u.id); toast.success('User deactivated'); fetchAll(); }
        catch { toast.error('Action failed'); }
    };

    const handleReset = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await resetPassword(resetTarget.id, resetForm);
            toast.success('Password reset successfully');
            setModal(null); setResetTarget(null);
        } catch (err) { toast.error(err.response?.data?.message || 'Reset failed'); }
        setLoading(false);
    };

    const F = ({ label, children }) => (
        <div><label className="block text-sm text-slate-400 mb-1">{label}</label>{children}</div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MdPeople className="text-primary-400" /> User Management
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">{users.filter(u => u.is_active).length} active users</p>
                </div>
                <button onClick={() => setModal('register')} className="btn-primary"><MdAdd /> Add User</button>
            </div>

            {/* Search */}
            <div className="card py-4">
                <div className="relative max-w-md">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="inp pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="tbl-head">
                            <tr>
                                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">No users found</td></tr>
                            )}
                            {filtered.map(u => (
                                <tr key={u.id} className="tbl-row">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-200">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-400">{u.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${ROLE_CLASS[u.role]}`}>{u.role}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.is_active ? 'badge-approved' : 'bg-slate-700/60 text-slate-500'}`}>
                                            {u.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-1">
                                            <button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors" title="Edit">
                                                <MdEdit />
                                            </button>
                                            <button onClick={() => { setResetTarget(u); setResetForm({ newPassword: '' }); setModal('reset'); }}
                                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="Reset Password">
                                                <MdLockReset />
                                            </button>
                                            {u.is_active && (
                                                <button onClick={() => handleDeactivate(u)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Deactivate">
                                                    <MdPersonOff />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Register User Modal */}
            {modal === 'register' && (
                <Modal title="Register New User" onClose={() => setModal(null)} size="sm">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <F label="Full Name *"><input className="inp" value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} required /></F>
                        <F label="Email *"><input type="email" className="inp" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} required /></F>
                        <F label="Password *"><input type="password" className="inp" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} required /></F>
                        <F label="Role">
                            <select className="inp" value={regForm.role} onChange={e => setRegForm({ ...regForm, role: e.target.value })}>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </F>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Registering...' : 'Register User'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit User Modal */}
            {modal === 'edit' && editUser && (
                <Modal title={`Edit User: ${editUser.name}`} onClose={() => setModal(null)} size="sm">
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <F label="Full Name *"><input className="inp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></F>
                        <F label="Email *"><input type="email" className="inp" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></F>
                        <F label="Role">
                            <select className="inp" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </F>
                        <F label="Status">
                            <select className="inp" value={form.is_active} onChange={e => setForm({ ...form, is_active: parseInt(e.target.value) })}>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </F>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Reset Password Modal */}
            {modal === 'reset' && resetTarget && (
                <Modal title={`Reset Password: ${resetTarget.name}`} onClose={() => setModal(null)} size="sm">
                    <form onSubmit={handleReset} className="space-y-4">
                        <F label="New Password *">
                            <input type="password" className="inp" value={resetForm.newPassword} onChange={e => setResetForm({ newPassword: e.target.value })} required minLength={6} />
                        </F>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-danger">{loading ? 'Resetting...' : 'Reset Password'}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
