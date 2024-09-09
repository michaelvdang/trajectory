'use client';
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/ui/Header';
import { db } from '@/firebase';
import { JobData, MatchData, SkillAssessment, SkillAssessments, UserData } from '@/types';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { doc, getDoc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Logo from "@/assets/images/traj_logo_blackR-removebg-preview.png"; 
import { Footer } from "@/components/ui/Footer";

const JobPage = ({ params }: { params: { jobId: string } }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const [targetJob, setTargetJob] = useState<string | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const jobId = params.jobId;
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessments | null>(null);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setTargetJob(localStorage.getItem('targetJob'));

    const targetJobMatchesString = localStorage.getItem('targetJobMatches');
    const targetJobMatches: MatchData[] = targetJobMatchesString ? JSON.parse(targetJobMatchesString) : [];
    setTargetJobMatches(targetJobMatches);

    const topMatchesString = localStorage.getItem('topMatches');
    const topMatches: MatchData[] = topMatchesString ? JSON.parse(topMatchesString) : [];
    setTopMatches(topMatches);

    let allMatches = [];
    allMatches.push(...(targetJobMatches ?? []));
    allMatches.push(...(topMatches ?? []));
    const job = allMatches?.find((match: MatchData) => match.id === jobId);
    if (job) {
      setJobData(job);
    } else {
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
      } else {
        console.log('job data not found');
        alert('Job data not found. You will be redirected to the home page.');
        router.push('/');
      }
    } catch (error) {
      console.log('handleSubmitTargetJob error: ', error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        alert('Please sign in first. You will now be redirected to the home page.');
        router.push('/');
        return;
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

  useEffect(() => {
    const getMissingSkillAssessments = async () => {
      if (isLoaded && isSignedIn && user && jobData) {
        try {
          const userDocRef = doc(db, 'users', user.id);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (!data.assessments) {
              data.assessments = {};
            }
            const currentAssessments: SkillAssessments = data.assessments;
            const missingSkills = jobData.skills.filter((skill) => !(skill in currentAssessments));
            if (missingSkills && missingSkills.length > 0) {
              const userData = data.userData;
              const response = await axios.post(
                `/api/createAssessments`,
                {
                  userData,
                  missingSkills,
                }
              );
              const missingSkillAssessments = response.data.assessments;
              const batch = writeBatch(db);
              for (const [skill, score] of missingSkillAssessments) {
                const assessment: SkillAssessment = {
                  name: skill,
                  score,
                  status: score > 3 ? 'complete' : 'incomplete',
                };
                batch.set(userDocRef, { assessments: { [skill]: assessment } }, { merge: true });
                currentAssessments[skill] = assessment;
              }
              await batch.commit();
            }
            setSkillAssessments(currentAssessments);
          }
        } catch (error) {
          console.log('getSkillAssessments error: ', error);
        }
      }
    };
    getMissingSkillAssessments();
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
  };

  // If job data and skill assessments are not loaded, display loading
  if (jobData && jobData.skills.length > 0 && !skillAssessments) {
    return <div className='flex justify-center items-center h-screen'><Loader className="w-12 h-12 animate-spin" /></div>;
  }

  // Score Bar Calculation
  const calculateOverallScore = () => {
    if (!skillAssessments || !jobData) return 0;
    const totalSkills = jobData.skills.length;
    const completedSkills = jobData.skills.filter(skill => skillAssessments[skill]?.status === 'complete').length;
    return Math.round((completedSkills / totalSkills) * 100);
  };

  return (
    <>
      <div className="min-h-screen bg-white text-black flex flex-col overflow-hidden">
        
        <Header />
        
        <header className="bg-purple-100 p-4 border-b border-black shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <Image src={Logo} alt="SaaS Logo" height={150} width={150} />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-black focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
    
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden mt-8">  {/* Increased space from header */}
          
          {/* Sidebar */}
          <div
            className={`md:w-64 bg-purple-100 border-r border-black p-4 ${
              sidebarOpen ? "block" : "hidden"
            } md:block md:relative transition-transform duration-200 ease-in-out z-20`}
          >
            <h2 className="text-2xl font-bold mb-6">Menu</h2>
            <nav className="space-y-2">
              <a href="#" className="block py-2 px-4 rounded-lg bg-purple-800 text-white">
                Dashboard
              </a>
              <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-purple-700 hover:text-white transition-colors">
                Assignments
              </a>
              <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-purple-700 hover:text-white transition-colors">
                Progress
              </a>
              <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-purple-700 hover:text-white transition-colors">
                Settings
              </a>
            </nav>
          </div>
    
          {/* Overlay for mobile view */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
    
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-scroll bg-gradient-to-br from-white via-purple-50 to-purple-100 border-l border-purple-300 shadow-inner">
            <div className="max-w-5xl mx-auto">
              
              {/* Main Content */}
              <div className="flex flex-col w-full px-8">
                {/* Row with Welcome and JobTitle */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-800 via-purple-400 to-purple-300 bg-clip-text text-transparent mb-4 md:mb-0">
                    Welcome!
                  </h1>
                  <h1 className="text-xl font-bold mt-4 md:mt-0">{jobData && jobData.title}</h1>
                </div>

                {/* Centered Score Bar */}
                <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 mb-4 mt-6"> {/* Adjusted spacing */}
                  <div className="bg-gray-300 h-4 rounded-lg">
                    <div
                      className="bg-purple-950 h-4 rounded-lg"
                      style={{ width: `${calculateOverallScore()}%` }}  // Dynamically set the width based on the overall score
                    ></div>
                  </div>
                  <p className="text-right mt-2">{calculateOverallScore()}% complete</p>
                </div>

                {/* Job Title */}
                <div className="flex justify-end mt-4"> {/* Adjusted spacing */}
                  {jobData && jobData.skills.length > 0 && (
                    <div className="max-w-4xl w-full py-6"> {/* Adjusted spacing */}
                      <h2 className="text-xl font-bold mb-4">Skills</h2>
                      <ul>
                        {skillAssessments && jobData.skills.map((skill) => (
                          <li
                            key={skillAssessments[skill].name}
                            className="flex justify-between items-center border border-gray-300 group hover:bg-gradient-to-br from-slate-50 via-violet-200 to-slate-50 transition duration-300 ease-in-out p-4 rounded-lg mb-4"
                          >
                            <div className="flex items-center space-x-6">
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
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default JobPage;

