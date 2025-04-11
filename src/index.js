// src/index.js
const express = require('express');
const proxyRoutes = require('./routes/lineProxyRoutes'); // ✅ 中継用ルートに変更

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Webhookルートは中継処理に任せる
app.use('/line/webhook', proxyRoutes);

module.exports = app;
