const express = require('express');
const { lineWebhook } = require('../controllers/lineController');

const router = express.Router();

// ✅ ここが '/' であること（すでに '/line/webhook' でマウント済み）
router.post('/', lineWebhook);

module.exports = router;
