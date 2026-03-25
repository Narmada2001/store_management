const express = require('express');
const router = express.Router();
const { login, register, changePassword, forgotPassword } = require('../controllers/auth.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/register', register); // Now public
router.post('/forgot-password', (req, res) => res.json({ success: true, message: 'Reset link sent' }));
router.post('/change-password', authenticate, changePassword);

module.exports = router;
