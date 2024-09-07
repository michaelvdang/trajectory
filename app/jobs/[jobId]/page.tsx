'use client';
import { Header } from '@/components/ui/Header';
import { db } from '@/firebase';
import { JobData, MatchData, SkillAssessment, SkillAssessments, UserData } from '@/types';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Footer } from "@/components/ui/Footer";
import Image from "next/image";
import Logo from "@/assets/images/traj_logo_blackR-removebg-preview.png";

const JobPage = ({ params }: { params: { jobId: string } }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessments | null>(null);
  const [completedSkills, setCompletedSkills] = useState(0); // Score tracking state
  const [jobData, setJobData] = useState<JobData | null>(null);
  const jobId = params.jobId;

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);
        if (jobSnap.exists()) {
          setJobData(jobSnap.data() as JobData);
        } else {
          console.log('Job not found');
          router.push('/');
        }
      } catch (error) {
        console.log('Error fetching job data: ', error);
      }
    };

    fetchJobDetails();
  }, [jobId, router]);

  const toggleSkillStatus = async (skill: string) => {
    if (isLoaded && isSignedIn && user && skillAssessments && skill in skillAssessments) {
      const newAssessments = { ...skillAssessments };
      newAssessments[skill].status = newAssessments[skill].status === 'incomplete' ? 'complete' : 'incomplete';
      setSkillAssessments(newAssessments);

      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, { assessments: newAssessments });
      calculateCompletedSkills(newAssessments); // Update progress
    }
  };

  const calculateCompletedSkills = (assessments: SkillAssessments) => {
    const completedCount = Object.values(assessments).filter((a) => a.status === 'complete').length;
    setCompletedSkills(completedCount);
  };

  if (!jobData || !skillAssessments) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const progress = (completedSkills / jobData.skills.length) * 100;

  return (
    <>
     <Header/>
      <header className="bg-purple-100 p-4 border-b border-black shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Image src={Logo} alt="SaaS Logo" height={150} width={150} />
          </div>
      </header>
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 text-black flex">
        {/* Sidebar */}
        <div className="w-1/5 min-h-full bg-purple-100 border-r border-black p-4 sm:hidden md:hidden">
          <div className="flex flex-col space-y-4">
            <div className="text-3xl font-bold text-purple-800 mb-8">Menu</div>
            <ul>
              <li className="mb-2 p-2 bg-purple-400 text-white rounded-lg cursor-pointer">Dashboard</li>
              <li className="mb-2 p-2 hover:bg-purple-300 rounded-lg cursor-pointer">Assignments</li>
              <li className="mb-2 p-2 hover:bg-purple-300 rounded-lg cursor-pointer">Progress</li>
              <li className="mb-2 p-2 hover:bg-purple-300 rounded-lg cursor-pointer">Settings</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-4/5 p-10">
          <div className="flex justify-between items-center">
          <h1 className="text-5xl font-bold text-purple-800">Welcome!</h1>
            <h1 className="text-2xl font-bold text-purple-800">{jobData.title}</h1>
            <div className="text-right">
              <h3 className="text-3xl font-bold text-purple-500">{`${progress.toFixed(0)}%`}</h3>
              <p className="text-purple-400">{`+${progress.toFixed(0)}% INCREASE`}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-purple-600 h-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Skills List */}
          <ul className="mt-10 space-y-6">
            {jobData.skills.map((skill, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 bg-white border border-purple-200 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={skillAssessments[skill]?.status === 'complete'}
                    onChange={() => toggleSkillStatus(skill)}
                    className="h-6 w-6 text-purple-800 focus:ring-purple-500 border-gray-300 rounded mr-4"
                  />
                  <div>
                    <h2 className="text-xl">{skill}</h2>
                    <p className="text-sm text-gray-500">{skillAssessments[skill]?.status === 'complete' ? 'COMPLETE' : 'INCOMPLETE'}</p>
                  </div>
                </div>
                <span className={`${skillAssessments[skill]?.status === 'complete' ? 'text-green-500' : 'text-red-500'} font-bold`}>
                  {skillAssessments[skill]?.status === 'complete' ? 'COMPLETE' : 'NOT STARTED'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobPage;


