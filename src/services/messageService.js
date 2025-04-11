// src/services/messageService.js
const { lineClient } = require('../configs/lineConfig');
const { getChatGPTResponse } = require('./openaiService');

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  const replyToken = event.replyToken;

  const responseText = await getChatGPTResponse(userMessage);

  return lineClient.replyMessage(replyToken, {
    type: 'text',
    text: responseText,
  });
}

module.exports = {
  handleEvent,
};
