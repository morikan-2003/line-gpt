// src/services/ragService.js
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
      topK: 3,
      includeMetadata: true,
    });

    const matches = searchResponse.matches || [];
    return matches.map(m => m.metadata.text).join('\n');
  } catch (err) {
    console.error('RAG Error:', err);
    return '';
  }
}

module.exports = {
  getRelevantContext,
};
