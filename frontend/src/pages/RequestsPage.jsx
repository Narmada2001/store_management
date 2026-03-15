import { useEffect, useState, useCallback } from 'react';
import { getRequests, createRequest, reviewRequest } from '../api/request.api';
import { getItems } from '../api/inventory.api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { MdAdd, MdAssignment, MdCheckCircle, MdCancel, MdSearch } from 'react-icons/md';

const STATUS_CLASS = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };

export default function RequestsPage() {
    const { isAdmin, user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [modal, setModal] = useState(null);
    const [reviewModal, setReviewModal] = useState(null);
    const [form, setForm] = useState({ item_id: '', quantity: '', purpose: '' });
    const [reviewForm, setReviewForm] = useState({ status: 'approved', admin_note: '' });
    const [loading, setLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        try {
            const [rRes, iRes] = await Promise.all([getRequests(), getItems()]);
            setRequests(rRes.data.data);
            setItems(iRes.data.data);
        } catch { toast.error('Failed to load requests'); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const filtered = requests.filter(r => {
        const matchSearch = r.item_name?.toLowerCase().includes(search.toLowerCase()) ||
            r.requester_name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter ? r.status === statusFilter : true;
        return matchSearch && matchStatus;
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createRequest(form);
            toast.success('Request submitted');
            fetchAll(); setModal(null); setForm({ item_id: '', quantity: '', purpose: '' });
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
        setLoading(false);
    };

    const handleReview = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await reviewRequest(reviewModal.id, reviewForm);
            toast.success(`Request ${reviewForm.status}`);
            fetchAll(); setReviewModal(null);
        } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><MdAssignment className="text-purple-400" /> Requests</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{isAdmin ? 'Review all staff requests' : 'Submit and track your requests'}</p>
                </div>
                <button onClick={() => setModal('new')} className="btn-primary"><MdAdd /> New Request</button>
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-3 items-center py-4">
                <div className="relative flex-1 min-w-48">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="inp pl-9" placeholder="Search by item or requester..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="inp w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="tbl-head">
                            <tr>
                                {['Item', 'Qty', 'Unit', 'Purpose', 'Requested By', 'Status', 'Date', ...(isAdmin ? ['Actions'] : [])].map(h => (
                                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No requests found</td></tr>
                            )}
                            {filtered.map(r => (
                                <tr key={r.id} className="tbl-row">
                                    <td className="px-5 py-3 font-medium text-slate-200">{r.item_name}</td>
                                    <td className="px-5 py-3 text-slate-300">{r.quantity}</td>
                                    <td className="px-5 py-3 text-slate-400">{r.unit}</td>
                                    <td className="px-5 py-3 text-slate-400 max-w-xs truncate">{r.purpose || '—'}</td>
                                    <td className="px-5 py-3 text-slate-400">{r.requester_name}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CLASS[r.status]}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                                        {new Date(r.created_at).toLocaleDateString()}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-5 py-3">
                                            {r.status === 'pending' && (
                                                <button onClick={() => { setReviewModal(r); setReviewForm({ status: 'approved', admin_note: '' }); }}
                                                    className="text-xs bg-primary-600/20 text-primary-400 border border-primary-500/30 px-3 py-1 rounded-lg hover:bg-primary-600/30 transition-colors">
                                                    Review
                                                </button>
                                            )}
                                            {r.status !== 'pending' && <span className="text-xs text-slate-600">Done</span>}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Request Modal */}
            {modal === 'new' && (
                <Modal title="New Item Request" onClose={() => setModal(null)} size="sm">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Item *</label>
                            <select className="inp" value={form.item_id} onChange={e => setForm({ ...form, item_id: e.target.value })} required>
                                <option value="">Select item...</option>
                                {items.map(i => <option key={i.id} value={i.id}>{i.name} (Stock: {i.quantity} {i.unit})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Quantity *</label>
                            <input type="number" min="1" className="inp" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Purpose / Reason</label>
                            <textarea className="inp" rows={3} value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="Describe why you need this item..." />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit Request'}</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Review Modal (Admin) */}
            {reviewModal && (
                <Modal title={`Review Request #${reviewModal.id}`} onClose={() => setReviewModal(null)} size="sm">
                    <div className="mb-4 p-3 bg-slate-900/50 rounded-xl space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Item</span><span className="text-slate-200 font-medium">{reviewModal.item_name}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Quantity</span><span className="text-slate-200">{reviewModal.quantity} {reviewModal.unit}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Requested By</span><span className="text-slate-200">{reviewModal.requester_name}</span></div>
                        {reviewModal.purpose && <div className="text-slate-400 pt-1">Purpose: <span className="text-slate-300">{reviewModal.purpose}</span></div>}
                    </div>
                    <form onSubmit={handleReview} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Decision *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['approved', 'rejected'].map(s => (
                                    <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, status: s })}
                                        className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${reviewForm.status === s
                                            ? s === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'
                                            : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                                        {s === 'approved' ? <span className="flex items-center justify-center gap-1"><MdCheckCircle /> Approve</span> : <span className="flex items-center justify-center gap-1"><MdCancel /> Reject</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Admin Note</label>
                            <textarea className="inp" rows={2} value={reviewForm.admin_note} onChange={e => setReviewForm({ ...reviewForm, admin_note: e.target.value })} placeholder="Optional note to requester..." />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setReviewModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className={reviewForm.status === 'approved' ? 'btn-success' : 'btn-danger'}>
                                {loading ? 'Processing...' : `Confirm ${reviewForm.status}`}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
