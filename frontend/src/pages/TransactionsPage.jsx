import { useEffect, useState, useCallback } from 'react';
import { getTransactions, createTransaction } from '../api/transaction.api';
import { getItems } from '../api/inventory.api';
import { getSuppliers } from '../api/transaction.api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { MdAdd, MdSwapHoriz, MdSearch, MdArrowDownward, MdArrowUpward } from 'react-icons/md';

const TYPE_CLASS = { received: 'badge-received', issued: 'badge-issued' };

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        type: 'received', item_id: '', quantity: '', reference_no: '',
        supplier_id: '', notes: '', transaction_date: new Date().toISOString().split('T')[0],
    });

    const fetchAll = useCallback(async () => {
        try {
            const params = {};
            if (typeFilter) params.type = typeFilter;
            const [tRes, iRes, sRes] = await Promise.all([
                getTransactions(params), getItems(), getSuppliers()
            ]);
            setTransactions(tRes.data.data);
            setItems(iRes.data.data);
            setSuppliers(sRes.data.data);
        } catch { toast.error('Failed to load transactions'); }
    }, [typeFilter]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const filtered = transactions.filter(t =>
        t.item_name?.toLowerCase().includes(search.toLowerCase()) ||
        (t.reference_no || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.performed_by_name || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTransaction(form);
            toast.success('Transaction recorded');
            fetchAll();
            setModal(false);
            setForm({ type: 'received', item_id: '', quantity: '', reference_no: '', supplier_id: '', notes: '', transaction_date: new Date().toISOString().split('T')[0] });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record transaction');
        }
        setLoading(false);
    };

    const F = ({ label, children }) => (
        <div><label className="block text-sm text-slate-400 mb-1">{label}</label>{children}</div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <MdSwapHoriz className="text-cyan-400" /> Transactions
                    </h2>
                    <p className="text-slate-400 text-sm mt-0.5">Record items received or issued from store</p>
                </div>
                <button onClick={() => setModal(true)} className="btn-primary"><MdAdd /> Record Transaction</button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card flex items-center gap-3 py-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                        <MdArrowDownward className="text-blue-400 text-xl" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs">Items Received (All Time)</p>
                        <p className="text-2xl font-bold text-white">
                            {transactions.filter(t => t.type === 'received').reduce((s, t) => s + t.quantity, 0)}
                        </p>
                    </div>
                </div>
                <div className="card flex items-center gap-3 py-4">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                        <MdArrowUpward className="text-purple-400 text-xl" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs">Items Issued (All Time)</p>
                        <p className="text-2xl font-bold text-white">
                            {transactions.filter(t => t.type === 'issued').reduce((s, t) => s + t.quantity, 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-3 items-center py-4">
                <div className="relative flex-1 min-w-48">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="inp pl-9" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="inp w-40" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="received">Received</option>
                    <option value="issued">Issued</option>
                </select>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="tbl-head">
                            <tr>
                                {['Date', 'Type', 'Item', 'Qty', 'Unit', 'Reference No', 'Supplier', 'Performed By', 'Notes'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={9} className="text-center py-12 text-slate-500">No transactions found</td></tr>
                            )}
                            {filtered.map(t => (
                                <tr key={t.id} className="tbl-row">
                                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{new Date(t.transaction_date).toLocaleDateString()}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${TYPE_CLASS[t.type]}`}>
                                            {t.type === 'received' ? <MdArrowDownward className="text-xs" /> : <MdArrowUpward className="text-xs" />} {t.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-medium text-slate-200">{t.item_name}</td>
                                    <td className="px-5 py-3 text-slate-300 font-semibold">{t.quantity}</td>
                                    <td className="px-5 py-3 text-slate-400">{t.unit}</td>
                                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{t.reference_no || '—'}</td>
                                    <td className="px-5 py-3 text-slate-400">{t.supplier_name || '—'}</td>
                                    <td className="px-5 py-3 text-slate-400">{t.performed_by_name}</td>
                                    <td className="px-5 py-3 text-slate-400 max-w-xs truncate">{t.notes || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Transaction Modal */}
            {modal && (
                <Modal title="Record Transaction" onClose={() => setModal(false)}>
                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Type toggle */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Transaction Type *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['received', 'issued'].map(t => (
                                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                                        className={`py-2.5 rounded-xl border text-sm font-medium capitalize flex items-center justify-center gap-2 transition-all ${form.type === t
                                                ? t === 'received'
                                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                                    : 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                                                : 'border-slate-600 text-slate-400 hover:border-slate-500'
                                            }`}>
                                        {t === 'received' ? <MdArrowDownward /> : <MdArrowUpward />} {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <F label="Item *">
                                    <select className="inp" value={form.item_id} onChange={e => setForm({ ...form, item_id: e.target.value })} required>
                                        <option value="">Select item...</option>
                                        {items.map(i => <option key={i.id} value={i.id}>{i.name} (Stock: {i.quantity})</option>)}
                                    </select>
                                </F>
                            </div>
                            <F label="Quantity *">
                                <input type="number" min="1" className="inp" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                            </F>
                            <F label="Transaction Date *">
                                <input type="date" className="inp" value={form.transaction_date} onChange={e => setForm({ ...form, transaction_date: e.target.value })} required />
                            </F>
                            <F label="Reference No.">
                                <input className="inp" placeholder="e.g. PO-2026-001" value={form.reference_no} onChange={e => setForm({ ...form, reference_no: e.target.value })} />
                            </F>
                            {form.type === 'received' && (
                                <F label="Supplier">
                                    <select className="inp" value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })}>
                                        <option value="">None</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </F>
                            )}
                            <div className="col-span-2">
                                <F label="Notes">
                                    <textarea className="inp" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                                </F>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Saving...' : 'Record Transaction'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
