require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const documentsPath = path.join(__dirname, 'documents.json');
  const documents = JSON.parse(fs.readFileSync(documentsPath, 'utf8'));

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX);

  const vectors = [];

  for (const doc of documents) {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: doc.text,
    });

    const embedding = embeddingResponse.data[0].embedding;

    vectors.push({
      id: doc.id,
      values: embedding,
      metadata: {
        text: doc.text,
        type: doc.type || 'general', // ← 🔥 ここで type を反映
      },
    });
  }

  await index.upsert(vectors);
  console.log('✅ Embedding & Upsert completed!');
}

main();
