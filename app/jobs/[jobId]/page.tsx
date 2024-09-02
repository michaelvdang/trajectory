'use client';
import { Header } from '@/components/ui/Header';
import { db } from '@/firebase';
import { JobData, MatchData, UserData } from '@/types';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

const JobPage = ({params} : {params: {jobId: string}}) => {
  const [userData, setUserData] = useState<UserData>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const [targetJob, setTargetJob] = useState<string>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [jobData, setJobData] = useState<JobData>(null);
  const jobId = params.jobId;

  useEffect(() => {
    setTargetJob(localStorage.getItem('targetJob'));
  }, []);

  const getJobDetails = async () => {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        const jobData = jobSnap.data();
        setJobData({
          id: jobData.job_id,
          title: jobData.title,
          skills: jobData.skills_needed,
        });
      }
      else {
        console.log('job data not found');
      }
      
    }
    catch (error) {
      console.log('handleSubmitTargetJob error: ', error);
    }
  }
  
  useEffect(() => {
    if (targetJob) {
      const targetJobMatches : MatchData[] = JSON.parse(localStorage.getItem('targetJobMatches'));
      setTargetJobMatches(targetJobMatches);
      const topMatches : MatchData[] = JSON.parse(localStorage.getItem('topMatches'));
      setTopMatches(topMatches);
      // check if job is in localstorage
      let allMatches = [];
      allMatches.push(...(targetJobMatches ?? []));
      allMatches.push(...(topMatches ?? []));
      const job = allMatches?.find((match : MatchData) => match.id === jobId);
      if (job) {
        setJobData(job);
      }
      else {
        getJobDetails();
      }
    }
  }, [targetJob]);

  // get job title required skills and experience

  // get user skills assessments, default to 1 if not in firestore

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const userDocRef = doc(db, 'users', user.id);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData(data.userData);
          setTopMatches(data.topMatches);
          console.log('onsnapshot userData: ', data.userData);
          console.log('onsnapshot topMatches: ', data.topMatches);
        }
      });
      return () => unsubscribe();
    }
  }, [isLoaded, isSignedIn, user]);
  
  return (
    // Display a specific job and its required skills and experience
    // compare with user's skills and experience?
    <>
    <Header />
    <div className="flex flex-col items-center pt-20">
      <h1 className="text-3xl font-bold mb-4">{params.jobId}</h1>
    </div>
    <div

    >
      {jobData && jobData.skills.length > 0 && (
        <>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Required Skills:</h2>
            <ul>
              {jobData.skills.map((skill, index) => (
                <li key={index} className="text-lg mb-2">{skill}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
    </>
  )
}

export default JobPage