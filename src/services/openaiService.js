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
    // 🔍 RAGからコンテキストとスコアを取得
    const { context, score } = await getRelevantContext(userMessage);
    const relevantContext = typeof context === 'string' ? context : '';
    console.log('[RAGコンテキスト]', { context: relevantContext, score });

    // 🔧 プロンプト生成
    const systemPrompt = `
あなたは正確で誠実なアシスタントです。

ユーザーが「こんにちは」「ありがとう」など挨拶・雑談をした場合には、自然で丁寧に返してください。

以下の【参照情報】に基づいて質問に答えてください。
情報が含まれていない場合、または曖昧な場合には、次のフォールバック文を活用してください：

「${FALLBACK_TEXT}」

【参照情報】
${relevantContext}
    `.trim();

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    // 🔁 ChatGPT API呼び出し
    const response = await openai.chat.completions.create({
      model: process.env.GPT_MODEL || 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const answer = response.choices?.[0]?.message?.content?.trim() || '';

    // 🧠 回答がフォールバックっぽかったら未対応ログに記録
    const isFallback = answer.includes('申し訳ございません') && answer.includes('担当者に確認');

    if (isFallback) {
      await logUnhandledQuery({
        userId,
        message: userMessage,
        reason: 'ChatGPTが曖昧回答を返したため',
      });
    }

    // 📚 全ての質問ログに保存
    await logUserQuery({
      userId,
      message: userMessage,
      response: answer,
      relevantContext,
    });

    return answer;

  } catch (err) {
    console.error('❌ getChatGPTResponse Error:', err);

    if (err.response) {
      console.error('🔍 OpenAI API response error:', err.response.status, err.response.data);
    }

    return '申し訳ありません、エラーが発生しました。';
  }
}

module.exports = {
  getChatGPTResponse,
};
