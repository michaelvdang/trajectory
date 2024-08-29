import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import 'dotenv/config'; 
const result = dotenv.config({ path: '.env.local' });

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error('PINECONE_API_KEY is not defined in the environment variables.');
}

const queryPinecone = async (embedding, topK = 3) => {
  // get similar jobs from pinecone
  const pc = new Pinecone({ apiKey });
  const index = pc.index('trajectory-app');
  const queryResponse1 = await index.namespace("ns1").query({
    topK,
    vector: embedding,
    includeValues: true,
    includeMetadata: true
  });

  console.log('queryResponse1: ', queryResponse1);
  
  return queryResponse1
}

export default queryPinecone