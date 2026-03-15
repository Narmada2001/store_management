const db = require('../config/db');

// GET /api/suppliers
const getSuppliers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM suppliers ORDER BY name ASC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/suppliers
const createSupplier = async (req, res) => {
    try {
        const { name, contact_person, phone, email, address } = req.body;
        const [result] = await db.query(
            'INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES (?,?,?,?,?)',
            [name, contact_person, phone, email, address]
        );
        res.status(201).json({ success: true, message: 'Supplier added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/suppliers/:id
const updateSupplier = async (req, res) => {
    try {
        const { name, contact_person, phone, email, address } = req.body;
        await db.query(
            'UPDATE suppliers SET name=?, contact_person=?, phone=?, email=?, address=? WHERE id=?',
            [name, contact_person, phone, email, address, req.params.id]
        );
        res.json({ success: true, message: 'Supplier updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/suppliers/:id
const deleteSupplier = async (req, res) => {
    try {
        await db.query('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Supplier deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
