import s3 from "@/services/s3";
import uploadFilesS3 from "@/services/uploadFilesS3";
import { GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const Bucket = process.env.S3_BUCKET;
// get file from s3 bucket
export async function GET(request: Request) {
  const objKey = 'Michael Dang - Resume.pdf';
  
  try {
    // // list bucket content
    // const response0 = await s3.send(new ListObjectsCommand({ Bucket }));
    // return NextResponse.json({ Contents: response0?.Contents ?? []});

    // // get file
    const response = await s3.send(new GetObjectCommand({ Bucket, Key: objKey }));
    const stream = response.Body;

    // Convert the stream to a buffer
    const chunks = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);
    
    // // Send the buffer to localhost:8000
    await axios.post('http://localhost:8000/image', fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
    
    return NextResponse.json({ lastModified: response?.LastModified ?? []});

    return new Response('Hello, Next.js!')
  }
  catch (error) {
    console.log('error: ', error);

    return new Response(JSON.stringify(error), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}

// endpoint to upload a file to s3 bucket
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log('formData', formData);
    
    const files = formData.getAll("files") as File[];
    console.log('files', files);

    const responses = await uploadFilesS3(files);

    console.log('responses', responses);
    return NextResponse.json(responses);
  } catch (error: any) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: error.message });
  }
}