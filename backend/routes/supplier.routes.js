const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplier.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', getSuppliers);
router.post('/', requireAdmin, createSupplier);
router.put('/:id', requireAdmin, updateSupplier);
router.delete('/:id', requireAdmin, deleteSupplier);

module.exports = router;
