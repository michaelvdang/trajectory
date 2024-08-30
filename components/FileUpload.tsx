"use client";

import { useState } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Paperclip } from "lucide-react";
import axios from "axios";
import { Button } from "./ui/button";

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

const FileUploaderBox = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const userId = '123';
  const [topMatches, setTopMatches] = useState<any[]>([]);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

    // on success, trigger parser for resume by sending s3 file path
  const handleSuccess = async (userId: string, fileName: string) => {
    // send filePath (userId, fileName) to parseInit to download from s3
    const response = await fetch(`http://localhost:3000/api/parseInit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, fileName }),
    });
    if (response.ok) {
      console.log('success');
    }
    const data = await response.json();
    console.log('data from response: ', data);
    console.log(JSON.stringify(data))

    setTopMatches(data.data.topMatches);
  }

  const handleUpload = async () => {
    setTopMatches([]);
    
    if (!files) return;

    const formData = new FormData();
    const fileName = files[0].name;
    // validate fileName for illegal characters
    formData.append('fileName', fileName);
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post(`/api/users/${userId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status !== 200) {
        throw new Error('Upload failed.');
      }
      setUploadStatus('successful');
      // trigger resume parser
      handleSuccess(userId, fileName);
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
      {topMatches?.length > 0 && <p>Top matches: {JSON.stringify(topMatches)}</p>}
    </div>
  );
};

export default FileUploaderBox;
