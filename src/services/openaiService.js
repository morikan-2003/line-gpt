// src/services/openaiService.js
require('dotenv').config();
const OpenAI = require('openai');
const { getRelevantContext } = require('./ragService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ユーザーのメッセージを受け取り、RAGで文脈検索を行ってからChatGPTで回答を生成
 */
async function getChatGPTResponse(userMessage) {
  try {
    // 1. クエリから関連コンテキストを取得（ベクトル検索）
    const relevantText = await getRelevantContext(userMessage);
    console.log('[RAGコンテキスト]', relevantText || '(該当なし)');

    // 2. ChatGPTへ送るプロンプトを構成
    const systemPrompt = relevantText
      ? `あなたは知識のあるアシスタントです。以下のコンテキストを参考に、できるだけ正確に答えてください：\n\n${relevantText}`
      : 'あなたは知識のあるアシスタントです。ユーザーの質問に丁寧に答えてください。';

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    // 3. ChatGPTへリクエスト
    const response = await openai.chat.completions.create({
      model: process.env.GPT_MODEL || 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error('getChatGPTResponse Error:', err);
    return '申し訳ありません、エラーが発生しました。';
  }
}

module.exports = {
  getChatGPTResponse,
};
