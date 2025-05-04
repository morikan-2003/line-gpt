require('dotenv').config();
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pinecone.Index(process.env.PINECONE_INDEX);

  const query = "森寛太について教えて"; // ← 検索したい文字列

  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query,
  });

  const vector = embeddingResponse.data[0].embedding;

  const result = await index.query({
    vector,
    topK: 5,
    includeMetadata: true,
  });

  console.log("🔍 検索結果:");
  result.matches.forEach((match, i) => {
    console.log(`\n#${i + 1}`);
    console.log(`ID: ${match.id}`);
    console.log(`スコア: ${match.score}`);
    console.log(`本文: ${match.metadata?.text}`);
  });
}

main();
