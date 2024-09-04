import generateEmbeddings from "@/services/generateEmbeddings";
import queryPinecone from "@/services/queryPinecone";
// import { NextRequest } from "next/server";

export async function GET(request: Request) {
  return new Response('Hello, Next.js!')
}

// take input from resume parser
// search pinecone for similar jobs 
// return embeddings of similar jobs along with metadata with job titles
export async function POST(request: Request) {
  try {
    
    // const data = await request.json()
    // const input = JSON.parse(data);

    const input = await request.json();

    console.log('input: ', input);
    
    // get embedding
    const embedding = await generateEmbeddings(JSON.stringify(input));

    // query pinecone for similar jobs
    const queryResults = await queryPinecone(embedding.data[0].embedding);

    if (queryResults.matches) {
      return new Response(JSON.stringify(queryResults), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      })
    }
    else {
      return new Response('No results found', {
        headers: { 'Content-Type': 'application/json' },
        status: 404
      })
    }
  }
  catch (error) {
    console.log('error: ', error);

    return new Response(JSON.stringify(error), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}