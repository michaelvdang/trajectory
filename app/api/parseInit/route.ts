import s3 from "@/services/s3";
import uploadFilesS3 from "@/services/uploadFilesS3";
import { GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const Bucket = process.env.S3_BUCKET;
// get file from s3 bucket and send to localhost:8000/download
// go to http://localhost:3000/api/users/123/download
// for testing s3 download
export async function GET(request: Request) {


  
  const filePath = '123/Michael Dang - Resume.pdf'; // replace with S3 object key
  
  try {
    // // list bucket content
    // const response0 = await s3.send(new ListObjectsCommand({ Bucket }));
    // return NextResponse.json({ Contents: response0?.Contents ?? []});

    // // get file
    const response = await s3.send(new GetObjectCommand({ Bucket, Key: filePath }));
    const stream = response.Body;

    // Convert the stream to a buffer
    const chunks = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });

    // Create FormData to hold the file buffer and additional attributes
    const formData = new FormData();
    formData.append('file', blob, 'yourFileName.pdf'); // Attach the file with a filename
    formData.append('filepath', '/desired/path/on/server');  // Attach additional data
    formData.append('filename', 'yourFileName.pdf');         
    
    // // Send the buffer to localhost:8000
    await axios.post('http://localhost:8000/download', fileBuffer, {
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

// download the file from s3 to next server, then send the file to localhost:8000
// but if we want to we can send just the directory and filename to localhost:8000 and download it there (requires aws-sdk python setup)
export async function POST (
  request: NextRequest,
  ) {
  const { userId, fileName } = await request.json();

  // use userId and fileName to establish s3 file path
  const filePath = `${userId}/${fileName}`;
  console.log("filePath: ", filePath);
  
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
    
    // // Send the file content to localhost:8000
    const parseResponse = await axios.post('http://localhost:8000/parse', formData, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    console.log('parseResponse.data: ', parseResponse.data);
    
    return NextResponse.json({ data: parseResponse.data });
  }
  catch (error) {
    console.log('error: ', error);

    return new Response(JSON.stringify(error), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
  
}