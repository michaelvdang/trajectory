'use client';
import React, { useState } from 'react';
import axios from 'axios';

const AssetPicker = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const userId = '123';
  const [topMatches, setTopMatches] = useState<any[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
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

    setTopMatches(data.topMatches);
  }

  const handleUpload = async () => {
    setTopMatches([]);
    
    if (!selectedFiles) return;

    const formData = new FormData();
    const fileName = selectedFiles[0].name;
    // validate fileName for illegal characters
    formData.append('fileName', fileName);
    Array.from(selectedFiles).forEach(file => {
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
    <div>
      <input className="w-full border border-gray-300 rounded-md p-2 mt-2 text-black" type="file" name="file" onChange={handleFileChange} multiple={false}/>
      <button 
        className='w-20 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
      {topMatches.length > 0 && <p>Top matches: {JSON.stringify(topMatches)}</p>}
    </div>
  );
};

export default AssetPicker;
