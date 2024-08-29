import s3 from "@/services/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const uploadFilesS3 = async (files: File[]) => {
  const responses = await Promise.all(
    files.map(async (file) => {
      const Body = Buffer.from(await file.arrayBuffer());
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: file.name,
        Body: Body,
        ContentType: file.type,
      };

      try {
        const result = await s3.send(new PutObjectCommand(params));
        console.log('Upload result:', result);
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

export default uploadFilesS3