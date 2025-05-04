const express = require('express');
const router = express.Router();
const { generateSuggestions } = require('../services/ragService');

// 明示的なルートに変更
router.post('/rag-suggestions', async (req, res) => {
  try {
    const { ragData } = req.body;
    const suggestions = await generateSuggestions(ragData);
    res.json({ suggestions });
  } catch (err) {
    console.error('提案取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

module.exports = router;
