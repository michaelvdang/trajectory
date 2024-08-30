import s3 from "@/services/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createFolderIfNotExist } from "./s3/createFolderIfNotExist";

const uploadFilesS3 = async (directory: string, fileName: string, files: File[]) => {
  try {
    const bucket = process.env.S3_BUCKET;
    await createFolderIfNotExist(bucket, directory);
    
    const responses = await Promise.all(
      files.map(async (file) => {
        const Body = Buffer.from(await file.arrayBuffer());
        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: directory + '/' + fileName,
          Body: Body,
          ContentType: file.type,
        };

        try {
          const result = await s3.send(new PutObjectCommand(params));
          return result;
        } catch (error: any) {
          console.error('Upload error:', error);
          return { error: error.message };
        }
      })
    );

    console.log('responses', responses);
    return responses;
  }
  catch (error) {
    console.error('Error handling request:', error);
    return { error: error.message };
  }
}

export default uploadFilesS3