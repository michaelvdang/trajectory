

import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import 'dotenv/config'; 
import generateEmbeddings from './services/generateEmbeddings.js';
import queryPinecone from './services/queryPinecone.js';
const result = dotenv.config({ path: '.env.local' });

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

// get embedding
const embedding = await generateEmbeddings(JSON.stringify(input));
console.log('embedding: ', embedding);

queryPinecone(embedding.data[0].embedding);
