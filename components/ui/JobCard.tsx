'use client';
import React from 'react';
import Link from 'next/link'; // Make sure to import Link from 'next/link' or your routing library

type JobCardProps = {
  jobTitle: string;
  jobDescription: string;
  timeline: string;
  salary: string;
  difficulty: string;
};

export const JobCard: React.FC<JobCardProps> = ({
  jobTitle,
  jobDescription,
  timeline,
  salary,
  difficulty,
}) => {

  return (
    <div
      className="cursor-pointer border border-gray-300 rounded-lg py-3 px-5 max-w-[300px] bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Link href={`/jobs/${jobTitle}`} className="text-xl font-bold mb-2 block text-blue-600 hover:underline">
        {jobTitle}
      </Link>
      <p className="mb-3 font-light">{jobDescription}</p>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="font-light">TIMELINE:</div>
          <div className="font-medium text-md">{timeline}</div>
        </div>
        <div className="flex justify-between">
          <div className="font-light">SALARY:</div>
          <div className="font-medium text-md">{salary}</div>
        </div>
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
      </div>
    </div>
  );
};
