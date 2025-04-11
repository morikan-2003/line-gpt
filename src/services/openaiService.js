// src/services/openaiService.js
require('dotenv').config();
const OpenAI = require('openai');
const { getRelevantContext } = require('./ragService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getChatGPTResponse(userMessage) {
  try {
    const relevantText = await getRelevantContext(userMessage);
    console.log('[RAGコンテキスト]', relevantText || '(該当なし)');

    const contextMessage = relevantText
      ? `以下のコンテキストを踏まえて、ユーザーの質問にできるだけ正確に答えてください。\n\n${relevantText}`
      : 'あなたはビジネスアシスタントです。質問にできるだけ丁寧に答えてください。';

    const messages = [
      { role: 'system', content: contextMessage },
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: process.env.GPT_MODEL || 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('getChatGPTResponse Error:', error);
    return '申し訳ありません、エラーが発生しました。';
  }
}

module.exports = {
  getChatGPTResponse,
};
