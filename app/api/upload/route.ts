import s3 from "@/services/s3";
import { createFolderIfNotExist } from "@/services/s3/createFolderIfNotExist";
import uploadFilesS3 from "@/services/uploadFilesS3";
import { GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// receive form data from front end and upload to s3 bucket
export async function POST(
  request: NextRequest,
  context: { params: { userId: string } },
  ) {
  // const { userId } = context.params;

  try {
    const formData = await request.formData();
    // validate fileName for illegal characters
    const fileName = formData.get('fileName') as string;
    const files = formData.getAll("files") as File[];
    const userId = formData.get('userId') as string;

    const responses = await uploadFilesS3(userId, fileName, files);

    return NextResponse.json(responses);
  } catch (error: any) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: error.message });
  }

}
  