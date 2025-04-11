// src/index.js
const express = require('express');
const { middleware } = require('@line/bot-sdk');
const { lineConfig } = require('./configs/lineConfig');
const lineRoutes = require('./routes/lineRoutes');

const app = express();

// ✅ 正しいルーティング（ここが超重要）
app.use('/line/webhook', middleware(lineConfig), lineRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
