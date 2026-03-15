const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/transaction.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', getTransactions);
router.post('/', createTransaction);

module.exports = router;
