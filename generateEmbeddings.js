// const OpenAI = require('openai');
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbeddings(input) {
  const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: input,
  encoding_format: "float",
  });
  
  return embedding
}

export default generateEmbeddings