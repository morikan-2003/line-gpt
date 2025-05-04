// src/services/messageService.js
const { lineClient } = require('../configs/lineConfig');
const { getChatGPTResponse } = require('./openaiService');
const { saveChatHistory } = require('./chatLogService'); // Firestore保存用

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  const replyToken = event.replyToken;
  const userId = event.source?.userId || 'unknown';

  // 🔹 ユーザーの発言を保存
  await saveChatHistory(userId, 'user', userMessage);

  // 🔹 ChatGPTからの応答を生成
  const responseText = await getChatGPTResponse(userMessage, userId);

  // 🔹 Botの応答を保存
await saveChatHistory(userId, 'assistant', responseText);
  // 🔹 LINEに返答
  return lineClient.replyMessage(replyToken, {
    type: 'text',
    text: responseText,
  });
}

module.exports = {
  handleEvent,
};
