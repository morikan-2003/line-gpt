const { saveChatHistory } = require('../services/chatLogService');

router.post('/push', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) return res.status(400).json({ error: 'Missing fields' });

  try {
    // LINE送信
    const result = await pushMessageToUser(userId, message);

    // Firestore保存
    await saveChatHistory(userId, 'admin', message);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('❌ pushMessage error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});
