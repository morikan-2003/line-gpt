// ✅ src/routes/pushRoutes.js
const express = require('express');
const axios = require('axios');
const { saveChatHistory } = require('../services/chatLogService'); // 🔹 追加

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, message } = req.body;

  console.log('🔔 プッシュ送信開始:', { userId, message });

  if (!userId || !message) {
    return res.status(400).json({ message: 'userIdとmessageは必須です' });
  }

  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [{ type: 'text', text: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ LINE送信成功:', response.data);

    // 🔹 Firestoreにも保存
    await saveChatHistory(userId, 'admin', message);

    return res.status(200).json({ message: '送信成功', response: response.data });
  } catch (error) {
    console.error('❌ LINE送信失敗:', error.response?.data || error.message);
    return res.status(500).json({
      message: '送信エラー',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
