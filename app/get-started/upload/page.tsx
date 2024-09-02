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
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import useFirebase from "@/hooks/useFirebase";
import { auth, db } from "@/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { Header } from "@/components/ui/Header";
import Link from "next/link";

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
      // this function should be outside useEffect and attached to onSubmit for the targetJobDialog
      // query pinecone for matching job titles
      const handleSubmitTargetJob = async (targetJob: string) => {
        localStorage.setItem('targetJob', targetJob);
        if (targetJob.length === 0) {
          alert('Please enter a job title');
          return;
        }
        try {
          const response = await axios.post(
            `/api/search`, 
            { "message": JSON.stringify({targetJob}) }, 
            { headers: { 'Content-Type': 'application/json' } }
          )
          // store in local storage
          const targetJobMatches = response.data.matches.map((match: any) => (
            {
              title: match.metadata.title,
              skills: match.metadata.skills,
              score: match.score,
              id: match.id
            }
          ))
          localStorage.setItem('targetJobMatches', JSON.stringify(targetJobMatches));

          console.log("store in firestore")
          // save targetJob to firestore and targetJobMatches to firestore
          const userDocRef = doc(db, 'users', userId);
          // await setDoc(userDocRef, {targetJob, targetJobMatches}, { merge: true });
          const batch = writeBatch(db)
          batch.set(userDocRef, {targetJob: [targetJob], targetJobMatches}, { merge: true });
          await batch.commit();

          setUploadStatus('');
          setFileName('');
          // router.push(`/users/${userId.slice(-10)}/matches?fileName=${fileName}&targetJob=${targetJob}`);
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
      // // start parsing the uploaded file and save parsed data to firestore
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
    localStorage.setItem('fileName', fileName);
    // validate fileName for illegal characters
    formData.append('fileName', fileName);
    formData.append('userId', userId);
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post(`/api/upload`, formData, {
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
    <>
    <Header />
    <div
      className="flex flex-col items-center justify-center"
    >
      <div
        className="max-w-7xl w-full flex flex-col items-center "
      >
        <div className="flex justify-center items-center pt-16">
          <h1 className="text-3xl font-bold mb-4">Upload Your Resume</h1>
        </div>
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
        </div>
        <div
          className="max-w-xl md:max-w-3xl py-12 px-12 md:px-24 w-full flex justify-between gap-6"
        >
          <Link 
            href="/"
            className={buttonVariants({ variant: "default" })}
          >
            Prev
          </Link>
          <Link 
            href="/get-started/target-job"
            className={buttonVariants({ variant: "default" })}
          >
            Skip
          </Link>
          {uploadStatus === 'successful' ? (
            <Link 
              href="/get-started/target-job"
              className={buttonVariants({ variant: "default" })}
              
            >
              Next
            </Link>
          ) : (
            <Button disabled variant="default">Next</Button>
          )}
        </div>
      </div>  
    </div>
    </>
  );
};

export default FileUpload;
