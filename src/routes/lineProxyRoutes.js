// src/routes/lineProxyRoutes.js
const express = require('express');
const { lineWebhook } = require('../controllers/lineController');

const router = express.Router();

// LINEのWebhookからのPOSTリクエストを受け取るルート
router.post('/', async (req, res) => {
  try {
    await lineWebhook(req, res);
  } catch (err) {
    console.error('Webhook処理中のエラー:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
