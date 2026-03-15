const express = require('express');
const router = express.Router();
const { getRequests, createRequest, reviewRequest } = require('../controllers/request.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', getRequests);
router.post('/', createRequest);
router.put('/:id/review', requireAdmin, reviewRequest);

module.exports = router;
