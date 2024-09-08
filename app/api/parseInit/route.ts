import s3 from "@/services/s3/s3";
import uploadFilesS3 from "@/services/s3/uploadFilesS3";
import { GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import admin from '@/firebaseAdmin';
import { doc } from "firebase/firestore";
import generateSkillAssessments from "@/services/generateSkillAssessments";
import { MatchData } from "@/types";

const MODE = process.env.MODE as 'dev' | 'prod' | undefined;
console.log('mode: ', MODE);
const ADDRESSES: Record<'dev' | 'prod', string | undefined>  = {
  'dev': process.env.DEV_PYTHON_SERVER_ADDRESS,
  'prod': process.env.PROD_PYTHON_SERVER_ADDRESS,
}
console.log('ADDRESSES: ', ADDRESSES);

// Validate MODE and provide a default address if MODE is invalid
if (!MODE || !ADDRESSES[MODE]) {
  console.error(`Invalid or missing MODE environment variable. Defaulting to 'dev'.`);
}

const PYTHON_SERVER_ADDRESS = ADDRESSES[MODE || 'dev'];
console.log('using PYTHON_SERVER_ADDRESS: ', PYTHON_SERVER_ADDRESS);

const Bucket = process.env.S3_BUCKET;

// download the file from s3 to next server, then send the file to localhost:8000
// but if we want to we can send just the directory and filename to localhost:8000 and download it there (requires aws-sdk python setup)
export async function POST (
  request: NextRequest,
  ) {
  const { userId, fileName } = await request.json();

  // use userId and fileName to establish s3 file path
  const filePath = `${userId}/${fileName}`;
  
  try {
    // // list bucket content
    // const response0 = await s3.send(new ListObjectsCommand({ Bucket }));
    // return NextResponse.json({ Contents: response0?.Contents ?? []});

    // // get file from s3 as a stream, convert to buffer, then to blob, then send to localhost:8000
    const s3Response = await s3.send(new GetObjectCommand({ Bucket, Key: filePath }));
    const stream = s3Response.Body;
    // Convert the stream to a buffer
    const chunks = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });

    // Create FormData to hold the file buffer and additional attributes
    const formData = new FormData();
    formData.append('file', blob, fileName); // Attach the file with a filename
    formData.append('directory', userId);  // Attach additional data
    formData.append('fileName', fileName);

    console.log('${PYTHON_SERVER_ADDRESS}/parse: ', `${PYTHON_SERVER_ADDRESS}/parse`);
    
    // // Send the file content to parse service
    const parseResponse = await axios.post(`${PYTHON_SERVER_ADDRESS}/parse`, formData, {
      headers: {
        'Content-Type': 'application/pdf',
      },
      timeout: 60000,
    });

    // console.log('parseResponse: ', parseResponse);
    console.log('parseResponse.data: ', parseResponse.data); 

    const userData = {...parseResponse.data.userData};


    // // use userData to search for topJobMatches in pinecone
    const payload = {
      'skills': userData.skills,
      'languages': userData.languages,
      'experiences': userData.experiences,
      'projects': userData.projects,
      'certifications': userData.certifications,
    }
    const searchResponse = await axios.post('/api/search', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('searchResponse.data.matches;  ', searchResponse.data.matches);
    const topMatches: MatchData[] = [];
    for (const match of searchResponse.data.matches) {
      topMatches.push({
        id: match.id,
        title: match.metadata.title,
        skills: match.metadata.skills,
        description: match.metadata.description,
        timeline: match.metadata.timeline,
        salary: match.metadata.salary,
        location: match.metadata.location,
        score: match.score,
      })
    }
    
    
    
    // const topMatches: MatchData[] = 

    
    
    // const topMatches: MatchData[] = parseResponse.data.topMatches;

    // store languages and skills in firestore
    // store userData and topMatches in firestore, to be retrieved in matches page
    const userDocRef = admin.firestore().doc('users/' + userId);
    await userDocRef.set({userData, topMatches}, { merge: true });

    return NextResponse.json({ userData, topMatches });
    // return NextResponse.json({ ...parseResponse.data });
  }
  catch (error) {
    console.log('error: ', error);

    return new Response(JSON.stringify(error), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
  
}