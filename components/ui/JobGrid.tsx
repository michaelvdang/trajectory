import React from 'react';
import { JobCard } from '@/components/JobCard';

export const jobData = [
  { jobTitle: 'Software Engineer', jobDescription: 'Develop and maintain web applications.', timeline: '1-2 years', salary: '$80,000', difficulty: 'Medium' },
  { jobTitle: 'Data Scientist', jobDescription: 'Analyze data to gain insights.', timeline: '2-3 years', salary: '$100,000', difficulty: 'High' },
  { jobTitle: 'UI/UX Designer', jobDescription: 'Design user-friendly interfaces.', timeline: '6 months - 1 year', salary: '$70,000', difficulty: 'Low' },
  { jobTitle: 'UI/UX Designerss', jobDescription: 'Design user-friendly interfaces.', timeline: '6 months - 1 year', salary: '$70,000', difficulty: 'Low' },
  { jobTitle: 'UI/UX Designerjj', jobDescription: 'Design user-friendly interfaces.', timeline: '6 months - 1 year', salary: '$70,000', difficulty: 'Low' },
  { jobTitle: 'UI/UX Designerzz', jobDescription: 'Design user-friendly interfaces.', timeline: '6 months - 1 year', salary: '$70,000', difficulty: 'Low' },
  // Add more job entries as needed
];

export const JobGrid: React.FC = () => (
  <section className="bg-gradient-to-br from-slate-50 via-violet-300 to-slate-50 p-4 relative overflow-hidden px-2">
  
    {/* Job cards grid */}
    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
      {jobData.map((job, index) => (
        <JobCard
          key={index}
          jobTitle={job.jobTitle}
          jobDescription={job.jobDescription}
          timeline={job.timeline}
          salary={job.salary}
          difficulty={job.difficulty}
        />
      ))}
    </div>
  </section>
);


