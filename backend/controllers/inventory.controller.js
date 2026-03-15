const db = require('../config/db');

// GET /api/inventory/items
const getItems = async (req, res) => {
    try {
        const { category_id, low_stock } = req.query;
        let query = `
      SELECT i.*, c.name AS category_name, s.name AS supplier_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      WHERE 1=1
    `;
        const params = [];
        if (category_id) { query += ' AND i.category_id = ?'; params.push(category_id); }
        if (low_stock === 'true') { query += ' AND i.quantity <= i.reorder_level'; }
        query += ' ORDER BY i.name ASC';

        const [rows] = await db.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/inventory/items/:id
const getItemById = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT i.*, c.name AS category_name, s.name AS supplier_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       LEFT JOIN suppliers s ON i.supplier_id = s.id
       WHERE i.id = ?`,
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/inventory/items
const createItem = async (req, res) => {
    try {
        const { name, description, category_id, quantity, unit, reorder_level, supplier_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO items (name, description, category_id, quantity, unit, reorder_level, supplier_id) VALUES (?,?,?,?,?,?,?)',
            [name, description, category_id || null, quantity || 0, unit || 'pcs', reorder_level || 10, supplier_id || null]
        );
        res.status(201).json({ success: true, message: 'Item created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/inventory/items/:id
const updateItem = async (req, res) => {
    try {
        const { name, description, category_id, quantity, unit, reorder_level, supplier_id } = req.body;
        await db.query(
            'UPDATE items SET name=?, description=?, category_id=?, quantity=?, unit=?, reorder_level=?, supplier_id=? WHERE id=?',
            [name, description, category_id || null, quantity, unit, reorder_level, supplier_id || null, req.params.id]
        );
        res.json({ success: true, message: 'Item updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/inventory/items/:id
const deleteItem = async (req, res) => {
    try {
        await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── CATEGORIES ──────────────────────────────────────────────────────────────
const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
        res.status(201).json({ success: true, message: 'Category created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        await db.query('UPDATE categories SET name=?, description=? WHERE id=?', [name, description, req.params.id]);
        res.json({ success: true, message: 'Category updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getItems, getItemById, createItem, updateItem, deleteItem,
    getCategories, createCategory, updateCategory, deleteCategory,
};
