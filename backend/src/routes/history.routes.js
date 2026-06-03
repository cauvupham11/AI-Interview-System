const express = require('express');
const historyController = require('../controllers/history.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticate, historyController.getHistories);
router.get('/stats', authenticate, historyController.getHistoryStats);
router.get('/:id', authenticate, historyController.getHistoryById);

module.exports = router;
