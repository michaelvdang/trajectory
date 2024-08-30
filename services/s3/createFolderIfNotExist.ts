import s3 from "../s3";
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

async function createFolder(Bucket: string, Key: string) {
  // Ensure the key has a trailing slash to represent a folder
  const folderKey = Key.endsWith("/") ? Key : `${Key}/`;

  const command = new PutObjectCommand({
    Bucket,
    Key: folderKey, // Use the folder key with trailing slash
    Body: "", // Empty body to create a folder
  });

  return s3.send(command);
}

async function existsFolder(Bucket: string, Key: string) {
  const folderKey = Key.endsWith("/") ? Key : `${Key}/`;

  const command = new HeadObjectCommand({ Bucket, Key: folderKey });

  try {
    await s3.send(command);
    return true; // Folder exists
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false; // Folder does not exist
    } else {
      throw error; // Some other error occurred
    }
  }
}

export async function createFolderIfNotExist(Bucket: string, Key: string) {
  if (!(await existsFolder(Bucket, Key))) {
    console.log(`Folder "${Key}" does not exist. Creating...`);
    return createFolder(Bucket, Key);
  } else {
    console.log(`Folder "${Key}" already exists.`);
  }
}