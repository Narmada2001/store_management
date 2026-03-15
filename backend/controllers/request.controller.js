const db = require('../config/db');

// GET /api/requests
const getRequests = async (req, res) => {
    try {
        let query = `
      SELECT r.*, i.name AS item_name, i.unit,
             u.name AS requester_name,
             a.name AS reviewer_name
      FROM requests r
      JOIN items i ON r.item_id = i.id
      JOIN users u ON r.requested_by = u.id
      LEFT JOIN users a ON r.reviewed_by = a.id
    `;
        const params = [];
        // Staff see only their own requests
        if (req.user.role === 'staff') {
            query += ' WHERE r.requested_by = ?';
            params.push(req.user.id);
        }
        query += ' ORDER BY r.created_at DESC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/requests  (staff)
const createRequest = async (req, res) => {
    try {
        const { item_id, quantity, purpose } = req.body;
        if (!item_id || !quantity)
            return res.status(400).json({ success: false, message: 'item_id and quantity are required' });

        const [result] = await db.query(
            'INSERT INTO requests (item_id, requested_by, quantity, purpose) VALUES (?, ?, ?, ?)',
            [item_id, req.user.id, quantity, purpose || null]
        );
        res.status(201).json({ success: true, message: 'Request submitted', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/requests/:id  (admin: approve/reject)
const reviewRequest = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { status, admin_note } = req.body;
        if (!['approved', 'rejected'].includes(status))
            return res.status(400).json({ success: false, message: 'status must be approved or rejected' });

        const [rows] = await conn.query('SELECT * FROM requests WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Request not found' });

        const request = rows[0];
        if (request.status !== 'pending')
            return res.status(400).json({ success: false, message: 'Request already reviewed' });

        await conn.query(
            'UPDATE requests SET status=?, admin_note=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?',
            [status, admin_note || null, req.user.id, req.params.id]
        );

        // If approved → deduct stock and log transaction
        if (status === 'approved') {
            const [itemRows] = await conn.query('SELECT quantity FROM items WHERE id = ?', [request.item_id]);
            if (itemRows.length === 0 || itemRows[0].quantity < request.quantity) {
                await conn.rollback();
                return res.status(400).json({ success: false, message: 'Insufficient stock to approve request' });
            }
            await conn.query('UPDATE items SET quantity = quantity - ? WHERE id = ?', [request.quantity, request.item_id]);
            await conn.query(
                'INSERT INTO transactions (type, item_id, quantity, request_id, performed_by, notes, transaction_date) VALUES (?, ?, ?, ?, ?, ?, CURDATE())',
                ['issued', request.item_id, request.quantity, request.id, req.user.id, 'Auto-issued on request approval']
            );
        }

        await conn.commit();
        res.json({ success: true, message: `Request ${status}` });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ success: false, message: err.message });
    } finally {
        conn.release();
    }
};

module.exports = { getRequests, createRequest, reviewRequest };
