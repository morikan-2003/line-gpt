// src/routes/lineRoutes.js
const express = require('express');
const { lineWebhook } = require('../controllers/lineController');

const router = express.Router();

router.post('/', lineWebhook);

module.exports = router;
