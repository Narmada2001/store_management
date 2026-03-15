const express = require('express');
const router = express.Router();
const { login, register, changePassword } = require('../controllers/auth.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/register', authenticate, requireAdmin, register);
router.post('/change-password', authenticate, changePassword);

module.exports = router;
