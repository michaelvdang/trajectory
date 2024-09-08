'use client';
import { Header } from '@/components/ui/Header';
import { db } from '@/firebase';
import { JobData, MatchData, SkillAssessment, SkillAssessments, UserData } from '@/types';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { doc, getDoc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'




const JobPage = ({params} : {params: {jobId: string}}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const [targetJob, setTargetJob] = useState<string | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const jobId = params.jobId;
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessments | null>(null);


  const router = useRouter();

  useEffect(() => {
    setTargetJob(localStorage.getItem('targetJob'));

    const targetJobMatchesString = localStorage.getItem('targetJobMatches');

    const targetJobMatches: MatchData[] = targetJobMatchesString ? JSON.parse(targetJobMatchesString) : [];
    setTargetJobMatches(targetJobMatches);

    const topMatchesString = localStorage.getItem('topMatches');
    const topMatches: MatchData[] = topMatchesString ? JSON.parse(topMatchesString) : [];
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
  }, [jobId]);

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
      if (!user) {
        alert('Please sign in first. You will now be redirected to the home page.');
        router.push('/');
        return
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
  }, [isLoaded, isSignedIn, user, router]);

  // get job title required skills and experience
  // get user skills assessments, default to 1 if not in firestore
  useEffect(() => {
    const getMissingSkillAssessments = async () => {
      if (isLoaded && isSignedIn && user && jobData) {
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
            if (missingSkills && missingSkills.length > 0) {
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
                const assessment : SkillAssessment = {
                  name: skill,
                  score,
                  status: score > 3 ? 'complete' : 'incomplete',
                }
                batch.set(userDocRef, {assessments: {[skill]: assessment}}, { merge: true });
                currentAssessments[skill] = assessment;
              }
              await batch.commit();
              // set skillAssessments
              console.log('getSkillAssessments currentAssessments: ', currentAssessments);
            }
            setSkillAssessments(currentAssessments);
          }
        }
        catch (error) {
          console.log('getSkillAssessments error: ', error);
        }


      }
    }
    // if (isLoaded && isSignedIn && jobData && jobData.skills.length > 0) {
      getMissingSkillAssessments();
    // }
  }, [isLoaded, isSignedIn, user, jobData]);

  const toggleSkillStatus = async (skill: string) => {
    if (isLoaded && isSignedIn && user) {
      if (skillAssessments && skill in skillAssessments) {
        const newAssessments = { ...skillAssessments };
        newAssessments[skill].status = newAssessments[skill].status === 'incomplete' ? 'complete' : 'incomplete';
        setSkillAssessments(newAssessments);
        const userDocRef = doc(db, 'users', user.id);
        await updateDoc(userDocRef, { assessments: newAssessments });
      }
    }
  }






  if (jobData && jobData.skills.length > 0 && !skillAssessments) {
    return <div className='flex justify-center items-center h-screen'><Loader className="w-12 h-12 animate-spin" /></div>;




  }
  


  return (
    // Display a specific job and its required skills and experience
    // compare with user's skills and experience?
    <>
    <Header />
    <div className="flex flex-col items-center pt-20">
      <h1 className="text-3xl font-bold mb-4">{jobData && jobData.title}</h1>
    </div>
    <div

    >
      {jobData && jobData.skills.length > 0 && (
        <>
        <div
          className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
        >
          <div className="flex flex-col ">




















            <div
              className="flex justify-between"
            >
              <h2 className="text-xl font-bold mb-2 pl-12">Skills</h2>
              <h3 
                className="text-xl font-bold mb-2"






              >
                Assessments
              </h3>
            </div>
            <ul>
              {skillAssessments && jobData && jobData.skills.map((skill, index) => (
                <div
                  key={skillAssessments[skill].name}
                  className="flex justify-between items-center border border-white/15 group hover:bg-gradient-to-br from-slate-50 via-violet-200 to-slate-50 transition duration-300 ease-in-out p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={skillAssessments[skill].score > 3 || skillAssessments[skill].status === 'complete'}
                      onChange={() => toggleSkillStatus(skill)}
                      className="h-6 w-6 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div>
                      <h2 className="text-xl group-hover:text-black transition duration-300 ease-in-out">{skillAssessments[skill].name}</h2>
                      <p className="text-gray-400 text-sm group-hover:text-black transition duration-300 ease-in-out">{skillAssessments[skill]['status']}</p>
                    </div>
                  </div>
                  <span
                    className={`${
                      skillAssessments[skill].score > 3 || skillAssessments[skill].status === 'complete'
                        ? "text-green-500/70"
                        : "text-red-500/70"
                    } font-bold`}
                  >
                    {skillAssessments[skill].score}
                  </span>
                </div>
                // <li key={index} className="text-lg mb-2">{skill} : {skillAssessments && skillAssessments[skill]['score']}</li>
              ))}
            </ul>
          </div>


        </div>
        </>
      )}
    </div>
    </>
  )
}

export default JobPage;


