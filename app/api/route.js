import generateEmbeddings from "@/services/generateEmbeddings";
import queryPinecone from "@/services/queryPinecone";


export async function GET(request) {
  return new Response('Hello, Next.js!')
}

export async function POST(request) {
  const data = await request.json()
  
  console.log('JSON.parse(data.message): ', JSON.parse(data.message));
  console.log('data.message: ', data.message);

  const input = JSON.parse(data.message);
  
  // get embedding
  const embedding = await generateEmbeddings(JSON.stringify(input));
  console.log('embedding: ', embedding);

  const queryResults = await queryPinecone(embedding.data[0].embedding);

  console.log('queryResults: ', queryResults);
  console.log('queryResults.matches[0].id: ', queryResults.matches[0].id);

  if (queryResults.matches) {
    return new Response({
      message: JSON.stringify(queryResults),
      
    })
  }

  return new Response('route: POST /api')
  
}