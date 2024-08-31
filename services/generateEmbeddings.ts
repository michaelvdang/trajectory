import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-proj-p6DMz7dkbdDAOYDit67DT3BlbkFJ39KynVZBXLaJTNm8HLCH",
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