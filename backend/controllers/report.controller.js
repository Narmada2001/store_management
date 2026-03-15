const db = require('../config/db');

// GET /api/reports/inventory
const inventoryReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT i.id, i.name, i.quantity, i.unit, i.reorder_level,
             c.name AS category,
             s.name AS supplier,
             CASE WHEN i.quantity <= i.reorder_level THEN 1 ELSE 0 END AS is_low_stock
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ORDER BY i.name ASC
    `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/reports/requests
const requestsReport = async (req, res) => {
    try {
        const { start_date, end_date, status } = req.query;
        let query = `
      SELECT r.*, i.name AS item_name, i.unit,
             u.name AS requester_name, a.name AS reviewer_name
      FROM requests r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON r.requested_by = u.id
      LEFT JOIN users a ON r.reviewed_by = a.id
      WHERE 1=1
    `;
        const params = [];
        if (status) { query += ' AND r.status = ?'; params.push(status); }
        if (start_date) { query += ' AND DATE(r.created_at) >= ?'; params.push(start_date); }
        if (end_date) { query += ' AND DATE(r.created_at) <= ?'; params.push(end_date); }
        query += ' ORDER BY r.created_at DESC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/reports/transactions
const transactionsReport = async (req, res) => {
    try {
        const { start_date, end_date, type } = req.query;
        let query = `
      SELECT t.*, i.name AS item_name, i.unit,
             u.name AS performed_by_name, s.name AS supplier_name
      FROM transactions t
      JOIN items i ON t.item_id = i.id
      JOIN users u ON t.performed_by = u.id
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      WHERE 1=1
    `;
        const params = [];
        if (type) { query += ' AND t.type = ?'; params.push(type); }
        if (start_date) { query += ' AND t.transaction_date >= ?'; params.push(start_date); }
        if (end_date) { query += ' AND t.transaction_date <= ?'; params.push(end_date); }
        query += ' ORDER BY t.transaction_date DESC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/reports/summary
const dashboardSummary = async (req, res) => {
    try {
        const [[{ total_items }]] = await db.query('SELECT COUNT(*) AS total_items FROM items');
        const [[{ low_stock }]] = await db.query('SELECT COUNT(*) AS low_stock FROM items WHERE quantity <= reorder_level');
        const [[{ pending_requests }]] = await db.query("SELECT COUNT(*) AS pending_requests FROM requests WHERE status = 'pending'");
        const [[{ total_suppliers }]] = await db.query('SELECT COUNT(*) AS total_suppliers FROM suppliers');
        const [[{ today_transactions }]] = await db.query('SELECT COUNT(*) AS today_transactions FROM transactions WHERE transaction_date = CURDATE()');

        res.json({
            success: true,
            data: { total_items, low_stock, pending_requests, total_suppliers, today_transactions }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { inventoryReport, requestsReport, transactionsReport, dashboardSummary };
