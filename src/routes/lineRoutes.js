const express = require('express');
const { lineWebhook } = require('../controllers/lineController');

const router = express.Router();

router.post('/', lineWebhook); // ✅ '/line/webhook' に対してPOSTを処理

module.exports = router;
