"use client";

import { useEffect, useState } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Paperclip } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import useFirebase from "@/hooks/useFirebase";
import { auth } from "@/firebase";
import { signInWithCustomToken } from "firebase/auth";

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to Upload or </span>
        <span className="font-semibold">Drag and Drop</span>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX</p>
    </>
  );
};

const FileUpload = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const { isLoaded, isSignedIn, user } = useUser();
  const [userId, setUserId] = useState<string>('');
  // const userId = '123';
  const [fileName, setFileName] = useState<string>('');
  const router = useRouter();
  const [targetJob, setTargetJob] = useState<string>('');
  const hasFirebase = useFirebase();

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUserId(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (targetJob) {
      // query pinecone for matching job titles
      const handleSubmitTargetJob = async (targetJob: string) => {
        try {
          const response = await axios.post(
            `/api/search`, 
            { "message": JSON.stringify({targetJob}) }, 
            { headers: { 'Content-Type': 'application/json' } }
          )
          console.log('getTargetJobMatches response: ', response.data.matches);
          // store in local storage
          const targetJobMatches = response.data.matches.map((match: any) => (
            {
              title: match.metadata.title,
              skills: match.metadata.skills,
              score: match.score,
              id: match.id
            }
          ))
          // save targetJob to firestore
          // save targetJobMatches to firestore
          
          console.log('targetJobMatches: ', targetJobMatches);
          localStorage.setItem('targetJobMatches', JSON.stringify(targetJobMatches));
          router.push(`/users/${userId.slice(-10)}/matches?fileName=${fileName}&targetJob=${targetJob}`);
          setUploadStatus('');
          setFileName('');
        }
        catch (error) {
          console.log('handleSubmitTargetJob error: ', error);
        }
      }
      handleSubmitTargetJob(targetJob);
    }
  }, [targetJob]);

  useEffect(() => {
    if (uploadStatus === 'successful') {
      // start parsing the uploaded file and save parsed data to firestore
      console.log("calling parseInit");
      fetch(`http://localhost:3000/api/parseInit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, fileName }),
      });
      console.log("called parseInit");
      
      // ask user to enter target jobs or navigate to /users/[userId]/matches
      // open targetJobDialog with handleSubmit(() => setTargetJob(value))
      setTargetJob('devops engineer');

    }
  }, [uploadStatus]);

  const handleUpload = async () => {    
    if (!files) return;
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const formData = new FormData();
    const fileName = files[0].name;
    setFileName(fileName);
    // validate fileName for illegal characters
    formData.append('fileName', fileName);
    formData.append('userId', userId);
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post(`/api/upload`, formData, {
      // const response = await axios.post(`/api/users/${userId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status !== 200) {
        throw new Error('Upload failed.');
      }
      setUploadStatus('successful');
     // useEffect hook to display target job dialog or avigate to /matches with userId and fileName as query parameters
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('failed');
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center gap-6 bg-background rounded-lg p-12 md:p-24  w-1/2 border border-gray-300 max-w-xl md:max-w-3xl mx-auto">
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={dropZoneConfig}
      >
        <FileInput className="outline-dashed outline-1 outline-white">
          <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
            <FileSvgDraw />
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
      {files && files.length > 0 && (
        <Button
          className="mt-8 px-4 py-2 w-[25%] bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleUpload}
          disabled={!files || files.length === 0}
        >
          Upload
        </Button>
      )}
      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-500">{uploadStatus}</p>
      )}
      {/* dialog to enter target job here */}
    </div>
  );
};

export default FileUpload;
