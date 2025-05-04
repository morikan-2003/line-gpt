require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index(process.env.PINECONE_INDEX);

async function embedPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = data.text;

  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  const embedding = embeddingResponse.data[0].embedding;

  await index.upsert([
    {
      id: `pdf-${Date.now()}`,
      values: embedding,
      metadata: {
        text: text.slice(0, 300), // メタデータに一部だけ
        type: 'pdf',
      },
    },
  ]);

  console.log('✅ PDFエンベッディング完了');
}

embedPDF(path.join(__dirname, '../uploads/sample.pdf'));
