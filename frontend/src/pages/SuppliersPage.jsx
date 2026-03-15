import { useEffect, useState, useCallback } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/transaction.api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdLocalShipping, MdPhone, MdEmail } from 'react-icons/md';

const EMPTY_FORM = { name: '', contact_person: '', phone: '', email: '', address: '' };

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [editSupplier, setEditSupplier] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        try {
            const res = await getSuppliers();
            setSuppliers(res.data.data);
        } catch { toast.error('Failed to load suppliers'); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.contact_person || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setForm(EMPTY_FORM); setEditSupplier(null); setModal('form'); };
    const openEdit = (s) => { setForm({ name: s.name, contact_person: s.contact_person || '', phone: s.phone || '', email: s.email || '', address: s.address || '' }); setEditSupplier(s); setModal('form'); };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editSupplier) { await updateSupplier(editSupplier.id, form); toast.success('Supplier updated'); }
            else { await createSupplier(form); toast.success('Supplier added'); }
            fetchAll(); setModal(null);
        } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
        setLoading(false);
    };

    const handleDelete = async (s) => {
        if (!confirm(`Delete supplier "${s.name}"?`)) return;
        try { await deleteSupplier(s.id); toast.success('Supplier deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    const F = ({ label, children }) => (
        <div><label className="block text-sm text-slate-400 mb-1">{label}</label>{children}</div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MdLocalShipping className="text-emerald-400" /> Suppliers
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">{suppliers.length} registered suppliers</p>
                </div>
                <button onClick={openAdd} className="btn-primary"><MdAdd /> Add Supplier</button>
            </div>

            {/* Search */}
            <div className="card py-4">
                <div className="relative max-w-md">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="inp pl-9" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.length === 0 && (
                    <div className="col-span-3 text-center py-16 text-slate-500">No suppliers found</div>
                )}
                {filtered.map(s => (
                    <div key={s.id} className="card hover:border-slate-600/70 transition-colors group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-lg">
                                    {s.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 text-sm">{s.name}</h3>
                                    {s.contact_person && <p className="text-xs text-slate-500">{s.contact_person}</p>}
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors"><MdEdit /></button>
                                <button onClick={() => handleDelete(s)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><MdDelete /></button>
                            </div>
                        </div>
                        <div className="space-y-1.5 text-sm">
                            {s.phone && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MdPhone className="text-slate-500 shrink-0" /> {s.phone}
                                </div>
                            )}
                            {s.email && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MdEmail className="text-slate-500 shrink-0" /> {s.email}
                                </div>
                            )}
                            {s.address && (
                                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{s.address}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Supplier Modal */}
            {modal === 'form' && (
                <Modal title={editSupplier ? 'Edit Supplier' : 'Add Supplier'} onClose={() => setModal(null)} size="sm">
                    <form onSubmit={handleSave} className="space-y-4">
                        <F label="Supplier Name *">
                            <input className="inp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </F>
                        <F label="Contact Person">
                            <input className="inp" value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })} />
                        </F>
                        <div className="grid grid-cols-2 gap-4">
                            <F label="Phone">
                                <input className="inp" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </F>
                            <F label="Email">
                                <input type="email" className="inp" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </F>
                        </div>
                        <F label="Address">
                            <textarea className="inp" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                        </F>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Saving...' : editSupplier ? 'Update Supplier' : 'Add Supplier'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
