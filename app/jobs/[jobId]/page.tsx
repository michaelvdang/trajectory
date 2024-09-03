'use client';
import { Header } from '@/components/ui/Header';
import { db } from '@/firebase';
import { JobData, MatchData, SkillAssessments, UserData } from '@/types';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { doc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const JobPage = ({params} : {params: {jobId: string}}) => {
  const [userData, setUserData] = useState<UserData>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const [targetJob, setTargetJob] = useState<string>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [jobData, setJobData] = useState<JobData>(null);
  const jobId = params.jobId;
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessments>(null);
  const [missingSkillAssessments, setMissingSkillAssessments] = useState<string[]>(null);
  const router = useRouter();

  useEffect(() => {
    setTargetJob(localStorage.getItem('targetJob'));

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
          skills: jobData.skills,
          description: jobData.description,
          timeline: jobData.timeline,
          salary: jobData.salary,
          location: jobData.location,
        });
      }
      else {
        console.log('job data not found');
        alert('Job data not found. You will be redirected to the home page.');
        router.push('/');
      }
      
    }
    catch (error) {
      console.log('handleSubmitTargetJob error: ', error);
    }
  }

    
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        alert('Please sign in first. You will now be redirected to the home page.');
        router.push('/');
      }
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

  // get job title required skills and experience
  // get user skills assessments, default to 1 if not in firestore
  useEffect(() => {
    const getMissingSkillAssessments = async () => {
      try {
        // get all skills assessments from fire store
        const userDocRef = doc(db, 'users', user.id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (!data.assessments) {
            data.assessments = {};
          }
          console.log('getSkillAssessments skillAssessments: ', data.assessments);
          // find skills in jobData.skills that are not in firestore
          const currentAssessments : SkillAssessments = data.assessments;
          console.log('getSkillAssessments assessments: ', currentAssessments);
          // console.log('getSkillAssessments assessments["AWS"]: ', currentAssessments["AWS"]);
          const missingSkills = jobData.skills.filter((skill) => !(skill in currentAssessments));
          // setMissingSkillAssessments(missingSkills);
          console.log('getSkillAssessments missingSkills: ', missingSkills);
          if (missingSkills.length > 0) {
            // if missingSkills.length > 0, fetch userData from firestore
            const userData = data.userData;
            // send userData, missingSkills to createSkillAssessment endpoint 
            const response = await axios.post(
              `/api/createAssessments`,
              {
                userData,
                missingSkills,
              }
            )
            const missingSkillAssessments = response.data.assessments;
            console.log('getSkillAssessments missingSkillAssessments: ', response.data.assessments);
            // store returned assessments in firestore
            const batch = writeBatch(db)
            for (const [skill, score] of missingSkillAssessments) {
              console.log("skill score", skill, score);
              batch.set(userDocRef, {assessments: {[skill]: score}}, { merge: true });
              currentAssessments[skill] = score;
            }
            await batch.commit();
            // set skillAssessments
            console.log('getSkillAssessments currentAssessments: ', currentAssessments);
            setSkillAssessments(currentAssessments);
          }
        }
      }
      catch (error) {
        console.log('getSkillAssessments error: ', error);
      }
    }
    if (isLoaded && isSignedIn && jobData && jobData.skills.length > 0) {
      getMissingSkillAssessments();
    }
  }, [isLoaded, isSignedIn, user, jobData]);






  
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
            <h2 className="text-xl font-bold mb-2">Users Assessments:</h2>
            <ul>
              {Object.entries(skillAssessments).map(([skill, score], index) => (
                <li key={index} className="text-lg mb-2">{skill} : {score}</li>
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