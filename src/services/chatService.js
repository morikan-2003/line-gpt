require('dotenv').config();
const OpenAI = require('openai');
const { getRelevantContext } = require('./ragService');
const { logUserQuery, logUnhandledQuery } = require('./logService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FALLBACK_TEXT = '申し訳ございません。その件についての正確な情報がありませんでしたので、は担当者に確認いたします。より急ぎでご回答を求められる場合には、こちらよりお問い合わせください。\nhttps://proudsync.studio.site/contact';

async function getChatGPTResponse(userMessage, userId = 'unknown') {
  try {
    const { context, score } = await getRelevantContext(userMessage);

    const systemPrompt = `
あなたは正確で誠実なアシスタントです。
以下の【参照情報】に基づいて質問に答えてください。
情報が不足している場合には次の文を使ってください：
"${FALLBACK_TEXT}"

【参照情報】
${context}
    `.trim();

    const response = await openai.chat.completions.create({
      model: process.env.GPT_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    const answer = response.choices[0]?.message?.content?.trim() || '';

    if (answer.includes('申し訳ございません') && answer.includes('担当者に確認')) {
      await logUnhandledQuery({ userId, message: userMessage, reason: '曖昧回答' });
    }

    await logUserQuery({ userId, message: userMessage, response: answer, relevantContext: context });

    return answer;
  } catch (err) {
    console.error('getChatGPTResponse error:', err);
    return FALLBACK_TEXT;
  }
}

module.exports = {
  getChatGPTResponse,
};
