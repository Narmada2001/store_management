import { useState } from 'react';
import { getInventoryReport, getRequestsReport, getTransactionsReport } from '../api/misc.api';
import toast from 'react-hot-toast';
import { MdBarChart, MdDownload, MdPictureAsPdf, MdTableChart, MdSearch, MdRefresh } from 'react-icons/md';

const REPORT_TYPES = [
    { key: 'inventory', label: 'Inventory Report', desc: 'Full stock levels with low-stock flags', color: 'text-primary-400', bg: 'bg-primary-500/20', border: 'border-primary-500/30' },
    { key: 'requests', label: 'Requests Report', desc: 'Request history with status & date range', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
    { key: 'transactions', label: 'Transactions Report', desc: 'Received/issued log with date range', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' },
];

// Column definitions per report
const COLUMNS = {
    inventory: ['Item Name', 'Category', 'Quantity', 'Unit', 'Reorder Level', 'Supplier', 'Low Stock'],
    requests: ['ID', 'Item', 'Qty', 'Requester', 'Status', 'Purpose', 'Date'],
    transactions: ['Date', 'Type', 'Item', 'Qty', 'Unit', 'Reference', 'Supplier', 'Performed By'],
};

const rowData = {
    inventory: r => [r.name, r.category, r.quantity, r.unit, r.reorder_level, r.supplier || '—', r.is_low_stock ? 'YES' : 'NO'],
    requests: r => [r.id, r.item_name, r.quantity, r.requester_name, r.status, r.purpose || '—', new Date(r.created_at).toLocaleDateString()],
    transactions: r => [new Date(r.transaction_date).toLocaleDateString(), r.type, r.item_name, r.quantity, r.unit, r.reference_no || '—', r.supplier_name || '—', r.performed_by_name],
};

export default function ReportsPage() {
    const [type, setType] = useState('inventory');
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ start_date: '', end_date: '', status: '' });
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            let res;
            if (type === 'inventory') res = await getInventoryReport();
            else if (type === 'requests') res = await getRequestsReport(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
            else res = await getTransactionsReport(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
            setData(res.data.data);
            setGenerated(true);
            toast.success(`Report generated — ${res.data.data.length} records`);
        } catch { toast.error('Failed to generate report'); }
        setLoading(false);
    };

    const getFiltered = () => {
        if (!search) return data;
        const s = search.toLowerCase();
        return data.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(s)));
    };

    const exportPDF = async () => {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(14);
        doc.text(`${REPORT_TYPES.find(t => t.key === type)?.label} — ${new Date().toLocaleDateString()}`, 14, 15);
        autoTable(doc, {
            head: [COLUMNS[type]],
            body: getFiltered().map(r => rowData[type](r)),
            startY: 22,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [30, 64, 175], textColor: 255 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            theme: 'striped',
        });
        doc.save(`${type}-report-${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('PDF exported');
    };

    const exportExcel = async () => {
        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();
        const rows = [COLUMNS[type], ...getFiltered().map(r => rowData[type](r))];
        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, type);
        XLSX.writeFile(wb, `${type}-report-${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel exported');
    };

    const filtered = getFiltered();
    const cols = COLUMNS[type];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MdBarChart className="text-emerald-400" /> Reports
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">Generate, view and export store reports</p>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {REPORT_TYPES.map(rt => (
                    <button key={rt.key} onClick={() => { setType(rt.key); setData([]); setGenerated(false); }}
                        className={`card text-left transition-all ${type === rt.key ? `border-2 ${rt.border} ${rt.bg}` : 'hover:border-slate-600'}`}>
                        <p className={`text-sm font-semibold ${rt.color}`}>{rt.label}</p>
                        <p className="text-xs text-slate-500 mt-1">{rt.desc}</p>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="card space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">Filters & Options</h3>
                <div className="flex flex-wrap gap-3 items-end">
                    {type !== 'inventory' && (
                        <>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                                <input type="date" className="inp w-40" value={filters.start_date} onChange={e => setFilters({ ...filters, start_date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">End Date</label>
                                <input type="date" className="inp w-40" value={filters.end_date} onChange={e => setFilters({ ...filters, end_date: e.target.value })} />
                            </div>
                        </>
                    )}
                    {type === 'requests' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Status</label>
                            <select className="inp w-36" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    )}
                    {type === 'transactions' && (
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Type</label>
                            <select className="inp w-36" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                                <option value="">All</option>
                                <option value="received">Received</option>
                                <option value="issued">Issued</option>
                            </select>
                        </div>
                    )}
                    <button onClick={fetchReport} disabled={loading}
                        className="btn-primary h-10 disabled:opacity-50">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg> Generating...
                            </span>
                        ) : <><MdRefresh /> Generate Report</>}
                    </button>
                </div>
            </div>

            {/* Results */}
            {generated && (
                <div className="space-y-3">
                    {/* Actions bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400">{filtered.length} records</span>
                            <div className="relative">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                <input className="inp pl-8 py-2 text-xs w-56" placeholder="Filter results..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={exportPDF} disabled={!filtered.length}
                                className="btn-danger gap-2 py-2 text-xs disabled:opacity-40">
                                <MdPictureAsPdf /> Export PDF
                            </button>
                            <button onClick={exportExcel} disabled={!filtered.length}
                                className="btn-success gap-2 py-2 text-xs disabled:opacity-40">
                                <MdTableChart /> Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="card p-0 overflow-hidden">
                        <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                            <table className="w-full text-xs">
                                <thead className="tbl-head sticky top-0 z-10">
                                    <tr>
                                        {cols.map(c => <th key={c} className="px-4 py-3 text-left whitespace-nowrap">{c}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={cols.length} className="text-center py-10 text-slate-500">No records found</td></tr>
                                    )}
                                    {filtered.map((row, i) => (
                                        <tr key={i} className="tbl-row">
                                            {rowData[type](row).map((cell, j) => (
                                                <td key={j} className={`px-4 py-2.5 text-slate-300 ${String(cell) === 'YES' ? 'text-amber-400 font-medium' :
                                                        String(cell) === 'approved' ? 'text-emerald-400' :
                                                            String(cell) === 'rejected' ? 'text-red-400' :
                                                                String(cell) === 'received' ? 'text-blue-400' :
                                                                    String(cell) === 'issued' ? 'text-purple-400' : ''
                                                    }`}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {!generated && (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                    <MdBarChart className="text-5xl text-slate-700 mb-3" />
                    <p className="text-slate-500 font-medium">Select a report type and click Generate Report</p>
                    <p className="text-slate-600 text-sm mt-1">Then export to PDF or Excel</p>
                </div>
            )}
        </div>
    );
}
