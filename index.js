

import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import 'dotenv/config'; // If using ES Module
import generateEmbeddings from './generateEmbeddings.js';
// require('dotenv').config(); // If using CommonJS
const result = dotenv.config({ path: '.env.local' });


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index('trajectory-app');

const input = [
        "Basic RDBMS concepts",
        "Install PostgreSQL",
        "Learn SQL",
        "Configuring PostgreSQL",
        "Database security",
        "Database infrastructure skills",
        "Database automation",
        "Database migrations",
        "Data and processing",
]

const embedding = await generateEmbeddings(JSON.stringify(input));
console.log('embedding: ', embedding);

const queryResponse1 = await index.namespace("ns1").query({
  topK: 3,
  vector: embedding.data[0].embedding,
  includeValues: true,
  includeMetadata: true
});

console.log('queryResponse1: ', queryResponse1);
