// src/routes/lineProxyRoutes.js
const express = require('express');
const axios = require('axios');
const { lineWebhook } = require('../controllers/lineController');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    // LステップのWebhookにそのまま転送
    await axios.post(process.env.LSTEP_WEBHOOK_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ChatGPT側にも処理させる
    return lineWebhook(req, res);
  } catch (err) {
    console.error('中継エラー:', err);
    return res.status(500).send('proxy error');
  }
});

module.exports = router;
