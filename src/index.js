const express = require('express');
const cors = require('cors');

// 各ルートを読み込む
const lineRoutes = require('./routes/lineProxyRoutes');
const pushRoutes = require('./routes/pushRoutes');
const ragSuggestionRoutes = require('./routes/ragSuggestionRoutes'); // ✅ ← これ重要

const app = express();

app.use(cors());
app.use(express.json());

// 各エンドポイントにルートをマウント
app.use('/line/webhook', lineRoutes);
app.use('/api', pushRoutes);
app.use('/api', ragSuggestionRoutes); // ✅ ここで ragSuggestionRoutes を /api にマウント

module.exports = app;
