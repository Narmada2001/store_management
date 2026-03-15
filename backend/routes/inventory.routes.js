const express = require('express');
const router = express.Router();
const {
    getItems, getItemById, createItem, updateItem, deleteItem,
    getCategories, createCategory, updateCategory, deleteCategory,
} = require('../controllers/inventory.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.use(authenticate);

// Items
router.get('/items', getItems);
router.get('/items/:id', getItemById);
router.post('/items', requireAdmin, createItem);
router.put('/items/:id', requireAdmin, updateItem);
router.delete('/items/:id', requireAdmin, deleteItem);

// Categories
router.get('/categories', getCategories);
router.post('/categories', requireAdmin, createCategory);
router.put('/categories/:id', requireAdmin, updateCategory);
router.delete('/categories/:id', requireAdmin, deleteCategory);

module.exports = router;
