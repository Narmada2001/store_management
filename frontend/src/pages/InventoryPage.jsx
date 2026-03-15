import { useEffect, useState, useCallback } from 'react';
import { getItems, createItem, updateItem, deleteItem, getCategories } from '../api/inventory.api';
import { getSuppliers } from '../api/transaction.api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdInventory2, MdWarning, MdFilterList } from 'react-icons/md';

const EMPTY_FORM = { name: '', description: '', category_id: '', quantity: '', unit: 'pcs', reorder_level: 10, supplier_id: '' };

const Badge = ({ qty, level }) => {
    const low = qty <= level;
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${low ? 'badge-pending' : 'badge-approved'}`}>
            {low && <MdWarning className="text-xs" />} {qty}
        </span>
    );
};

export default function InventoryPage() {
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [lowStock, setLowStock] = useState(false);
    const [modal, setModal] = useState(null); // 'add'|'edit'|'cat'
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [catForm, setCatForm] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        try {
            const params = {};
            if (catFilter) params.category_id = catFilter;
            if (lowStock) params.low_stock = 'true';
            const [iRes, cRes, sRes] = await Promise.all([getItems(params), getCategories(), getSuppliers()]);
            setItems(iRes.data.data);
            setCategories(cRes.data.data);
            setSuppliers(sRes.data.data);
        } catch { toast.error('Failed to load inventory'); }
    }, [catFilter, lowStock]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const filtered = items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.category_name || '').toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setForm(EMPTY_FORM); setEditItem(null); setModal('add'); };
    const openEdit = (item) => {
        setForm({ name: item.name, description: item.description || '', category_id: item.category_id || '', quantity: item.quantity, unit: item.unit, reorder_level: item.reorder_level, supplier_id: item.supplier_id || '' });
        setEditItem(item);
        setModal('edit');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editItem) { await updateItem(editItem.id, form); toast.success('Item updated'); }
            else { await createItem(form); toast.success('Item added'); }
            fetchAll(); setModal(null);
        } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
        setLoading(false);
    };

    const handleDelete = async (item) => {
        if (!confirm(`Delete "${item.name}"?`)) return;
        try { await deleteItem(item.id); toast.success('Item deleted'); fetchAll(); }
        catch { toast.error('Delete failed'); }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const { createCategory } = await import('../api/inventory.api');
            await createCategory(catForm);
            toast.success('Category added');
            fetchAll(); setModal(null);
        } catch { toast.error('Failed to add category'); }
    };

    const FormField = ({ label, children }) => (
        <div><label className="block text-sm text-slate-400 mb-1">{label}</label>{children}</div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><MdInventory2 className="text-primary-400" /> Inventory</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{items.length} items in store</p>
                </div>
                {isAdmin && (
                    <div className="flex gap-2">
                        <button onClick={() => setModal('cat')} className="btn-secondary"><MdAdd /> Category</button>
                        <button onClick={openAdd} className="btn-primary"><MdAdd /> Add Item</button>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="card flex flex-wrap gap-3 items-center py-4">
                <div className="relative flex-1 min-w-48">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="inp pl-9" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="inp w-48" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button onClick={() => setLowStock(v => !v)}
                    className={`btn-secondary gap-2 ${lowStock ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''}`}>
                    <MdFilterList /> {lowStock ? 'Low Stock' : 'All Stock'}
                </button>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="tbl-head">
                            <tr>{['Item Name', 'Category', 'Quantity', 'Unit', 'Reorder Lvl', 'Supplier', ...(isAdmin ? ['Actions'] : [])].map(h => (
                                <th key={h} className="px-5 py-3 text-left">{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No items found</td></tr>
                            )}
                            {filtered.map(item => (
                                <tr key={item.id} className="tbl-row">
                                    <td className="px-5 py-3 font-medium text-slate-200">{item.name}</td>
                                    <td className="px-5 py-3 text-slate-400">{item.category_name || '—'}</td>
                                    <td className="px-5 py-3"><Badge qty={item.quantity} level={item.reorder_level} /></td>
                                    <td className="px-5 py-3 text-slate-400">{item.unit}</td>
                                    <td className="px-5 py-3 text-slate-400">{item.reorder_level}</td>
                                    <td className="px-5 py-3 text-slate-400">{item.supplier_name || '—'}</td>
                                    {isAdmin && (
                                        <td className="px-5 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors"><MdEdit /></button>
                                                <button onClick={() => handleDelete(item)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><MdDelete /></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Item Modal */}
            {(modal === 'add' || modal === 'edit') && (
                <Modal title={modal === 'add' ? 'Add New Item' : 'Edit Item'} onClose={() => setModal(null)}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <FormField label="Item Name *">
                            <input className="inp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </FormField>
                        <FormField label="Description">
                            <textarea className="inp" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Category">
                                <select className="inp" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                                    <option value="">None</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Supplier">
                                <select className="inp" value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })}>
                                    <option value="">None</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Quantity *">
                                <input type="number" min="0" className="inp" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                            </FormField>
                            <FormField label="Unit">
                                <input className="inp" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
                            </FormField>
                            <FormField label="Reorder Level">
                                <input type="number" min="0" className="inp" value={form.reorder_level} onChange={e => setForm({ ...form, reorder_level: e.target.value })} />
                            </FormField>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Saving...' : (editItem ? 'Update Item' : 'Add Item')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Add Category Modal */}
            {modal === 'cat' && (
                <Modal title="Add Category" onClose={() => setModal(null)} size="sm">
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <FormField label="Category Name *">
                            <input className="inp" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
                        </FormField>
                        <FormField label="Description">
                            <textarea className="inp" rows={2} value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} />
                        </FormField>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary">Add Category</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
