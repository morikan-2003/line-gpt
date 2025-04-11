const express = require('express');
const { lineWebhook } = require('../controllers/lineController');

const router = express.Router();

// ✅ POST /line/webhook に対応するようにここは `/`
router.post('/', lineWebhook);

module.exports = router;
