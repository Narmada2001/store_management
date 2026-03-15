const db = require('../config/db');

// GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        const { type, start_date, end_date, item_id } = req.query;
        let query = `
      SELECT t.*, i.name AS item_name, i.unit,
             u.name AS performed_by_name,
             s.name AS supplier_name
      FROM transactions t
      JOIN items i ON t.item_id = i.id
      JOIN users u ON t.performed_by = u.id
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      WHERE 1=1
    `;
        const params = [];
        if (type) { query += ' AND t.type = ?'; params.push(type); }
        if (item_id) { query += ' AND t.item_id = ?'; params.push(item_id); }
        if (start_date) { query += ' AND t.transaction_date >= ?'; params.push(start_date); }
        if (end_date) { query += ' AND t.transaction_date <= ?'; params.push(end_date); }
        query += ' ORDER BY t.created_at DESC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/transactions  (record received / manual issued)
const createTransaction = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { type, item_id, quantity, reference_no, supplier_id, notes, transaction_date } = req.body;
        if (!type || !item_id || !quantity)
            return res.status(400).json({ success: false, message: 'type, item_id, and quantity are required' });

        if (type === 'issued') {
            const [itemRows] = await conn.query('SELECT quantity FROM items WHERE id = ?', [item_id]);
            if (itemRows.length === 0 || itemRows[0].quantity < quantity) {
                await conn.rollback();
                return res.status(400).json({ success: false, message: 'Insufficient stock' });
            }
            await conn.query('UPDATE items SET quantity = quantity - ? WHERE id = ?', [quantity, item_id]);
        } else if (type === 'received') {
            await conn.query('UPDATE items SET quantity = quantity + ? WHERE id = ?', [quantity, item_id]);
        }

        const [result] = await conn.query(
            'INSERT INTO transactions (type, item_id, quantity, reference_no, supplier_id, performed_by, notes, transaction_date) VALUES (?,?,?,?,?,?,?,?)',
            [type, item_id, quantity, reference_no || null, supplier_id || null, req.user.id, notes || null, transaction_date || new Date().toISOString().split('T')[0]]
        );

        await conn.commit();
        res.status(201).json({ success: true, message: 'Transaction recorded', id: result.insertId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ success: false, message: err.message });
    } finally {
        conn.release();
    }
};

module.exports = { getTransactions, createTransaction };
