const express = require('express');
const router = express.Router();
const { inventoryReport, requestsReport, transactionsReport, dashboardSummary } = require('../controllers/report.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/inventory', inventoryReport);
router.get('/requests', requestsReport);
router.get('/transactions', transactionsReport);
router.get('/summary', dashboardSummary);

module.exports = router;
