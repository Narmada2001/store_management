const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET /api/users
const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const { name, email, role, is_active } = req.body;
        const { id } = req.params;
        await db.query(
            'UPDATE users SET name=?, email=?, role=?, is_active=? WHERE id=?',
            [name, email, role, is_active, id]
        );
        res.json({ success: true, message: 'User updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/users/:id (soft delete)
const deleteUser = async (req, res) => {
    try {
        await db.query('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'User deactivated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/users/:id/reset-password (admin)
const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const hash = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.params.id]);
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getUsers, updateUser, deleteUser, resetPassword };
