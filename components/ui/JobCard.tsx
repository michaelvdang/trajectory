'use client';
import React from 'react';
import Link from 'next/link'; // Make sure to import Link from 'next/link' or your routing library
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

type JobCardProps = {
  jobId: string;
  jobTitle: string;
  jobDescription?: string;
  timeline?: string;
  salary?: string;
  difficulty?: string;
  pinned: boolean;
  togglePinned: (jobId: string, jobTitle: string) => Promise<void>;
};

export const JobCard: React.FC<JobCardProps> = ({
  jobId,
  jobTitle,
  jobDescription,
  timeline,
  salary,
  difficulty,
  pinned,
  togglePinned,
}) => {

  const handleTogglePinned = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    togglePinned(jobId, jobTitle);
  };

  return (
    <Link href={`/jobs/${jobId}`} className="w-full">
    <div
      className="cursor-pointer border border-gray-300 rounded-lg py-3 px-5 w-full bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div
        className="flex justify-between"
      >
        <h3 className="text-xl font-bold mb-2 block">{jobTitle}</h3>
        {pinned ? (
          <BookmarkIcon className="text-gray-500" onClick={handleTogglePinned}/>
        ) : (
          <BookmarkBorderIcon className="text-gray-500" onClick={handleTogglePinned}/>
        )}
      </div>
      {jobDescription && (<p className="mb-3 font-light">{jobDescription}</p>)}
      <div className="flex flex-col gap-1">
        {timeline && (
          <div className="flex justify-between">
            <div className="font-light">TIMELINE:</div>
            <div className="font-medium text-md">{timeline}</div>
          </div>
        )}
        {salary && (
          <div className="flex justify-between">
            <div className="font-light">SALARY:</div>
            <div className="font-medium text-md">{salary}</div>
          </div>
        )}
        {difficulty && (
          <div className="flex justify-between">
            <div className="font-light">DIFFICULTY:</div>
            <div
              className={`font-semibold text-md ${
                difficulty.toLowerCase() === 'low'
                  ? 'text-green-600'
                  : difficulty.toLowerCase() === 'high'
                  ? 'text-red-600'
                  : 'text-orange-600'
              }`}
            >
              {difficulty}
            </div>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
};
