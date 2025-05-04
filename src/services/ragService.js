require('dotenv').config();
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getRelevantContext(query) {
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);

    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
      includeValues: false,
    });

    const matches = searchResponse.matches || [];
    if (matches.length === 0) return { context: '', score: 0 };

    matches.sort((a, b) => b.score - a.score);
    const topScore = matches[0].score;
    const relevantMatches = matches.filter((m) => m.score >= 0.8);
    const context = relevantMatches.map((m) => m.metadata.text).join('\n');

    return { context, score: topScore };
  } catch (err) {
    console.error('RAG Error:', err);
    return { context: '', score: 0 };
  }
}

async function generateSuggestions(ragData) {
  try {
    const prompt = `
以下はFAQ・会社情報・商品情報・サポート情報のベース情報です。
RAGベースのAIがより良い回答を行うために、追加すべき情報を「質問形式と分類」で5つ提案してください。

# 既存データ:
${ragData.map((d) => `- (${d.type}) ${d.text}`).join('\n')}

# 出力形式:
[
  { "question": "返品ポリシーは？", "type": "support" },
  { "question": "営業時間は？", "type": "faq" }
]
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';

    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('JSON形式が見つかりません');

    const jsonString = content.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('generateSuggestions Error:', err);
    return [];
  }
}

// ✅ 明示的にエクスポート（←これが重要）
module.exports = {
  getRelevantContext,
  generateSuggestions,
};
