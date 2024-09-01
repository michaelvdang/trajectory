'use client';
import { db } from '@/firebase';
import { MatchData, UserData } from '@/types';
import { useUser } from '@clerk/nextjs';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

const JobPage = ({params} : {params: {jobTitle: string}}) => {
  const [userData, setUserData] = useState<UserData>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const [targetJob, setTargetJob] = useState<string>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  console.log("jobTitle: ", params.jobTitle)

  useEffect(() => {
    setTargetJob(localStorage.getItem('targetJob'));
  }, []);
    
  useEffect(() => {
    if (targetJob) {
      setTargetJobMatches(JSON.parse(localStorage.getItem('targetJobMatches')));
    }
  }, [targetJob]);

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
    <div className="flex flex-col items-center pt-20">
      <h1 className="text-3xl font-bold mb-4">{params.jobTitle}</h1>
    </div>
  )
}

export default JobPage