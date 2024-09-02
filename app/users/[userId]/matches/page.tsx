"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";
import Match from "@/components/Match";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { JobGrid } from "@/components/ui/JobGrid";
import { JobCard } from "@/components/ui/JobCard";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";


interface UserData {
  languages: string[];
  skills: string[];
  experience: string[];
  education: string[];
  activities: string[];
  projects: string[];
  certifications: string[];
}

interface MatchData {
  id: string;
  title: string;
  skills: string[];
  score: number;
}

export default function Jobs() {
  const [userData, setUserData] = useState<UserData>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const [targetJob, setTargetJob] = useState<string>(null);
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const fileName = searchParams.get("fileName");

  useEffect(() => {
    setTargetJob(localStorage.getItem('targetJob'));
  }, []);

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
  
  useEffect(() => {
    if (targetJob) {
      setTargetJobMatches(JSON.parse(localStorage.getItem('targetJobMatches')));
    }
  }, [targetJob]);
  
  const Loading = () => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  };

  if (targetJobMatches.length === 0 && !userData && topMatches.length === 0) {
    return (
      <Loading />
    );
  }

  return (
  <div className="flex flex-col items-center pt-16">
  {/* Background rings */}
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
      <div className="w-[620px] h-[620px] hero-ring"></div>
      <div className="w-[820px] h-[820px] hero-ring"></div>
      <div className="w-[1020px] h-[1020px] hero-ring"></div>
      <div className="w-[1220px] h-[1220px] hero-ring"></div>
    </div>
    <div className="max-w-7xl w-full flex flex-col md:flex-row  relative gap-x-12 px-4">
      <div className="w-full mt-6 flex flex-col ">
        <h2 className="text-xl font-bold mb-4 text-center">Top matches for {targetJob}</h2>
        <div
          className="w-full flex flex-col gap-y-4"
        >
          {targetJobMatches.length === 0 ? (
            <Loading />
          ) : (
            targetJobMatches.map((job, index) => (
              <JobCard
                key={index}
                jobTitle={job.title}
                jobDescription={"No description available"}
                timeline={"No timeline available"}
                salary={"No salary available"}
                difficulty={"No difficulty available"}
                // skills={job.skills}
                // score={job.score}
              />
            ))
          )}
        </div>
      </div>
      <div className="w-full mt-6 flex flex-col ">
        <h2 className="text-xl font-bold mb-4 text-center">Top matches for your resume</h2>
        <div
          className="w-full flex flex-col gap-y-4"
        >
          {topMatches && topMatches.length > 0 ? (
            topMatches.map((job, index) => (
              <JobCard
                key={index}
                jobTitle={job.title}
                jobDescription={"No description available"}
                timeline={"No timeline available"}
                salary={"No salary available"}
                difficulty={"No difficulty available"}
                // skills={job.skills}
                // score={job.score}
              />
            ))
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>

    {/* <JobGrid /> */}
  </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {userData && (
        <Profile
          languages={userData.languages}
          skills={userData.skills}
          experience={userData.experience}
          education={userData.education}
          activities={userData.activities}
          projects={userData.projects}
          certifications={userData.certifications}
        />
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Top Matches for {targetJob}</h2>
        {targetJobMatches.map((job, index) => (
          <Match
            key={index}
            title={job.title}
            skills={job.skills}
            score={job.score}
          />
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Top Matches for Your Resume</h2>
        {topMatches.map((match, index) => (
          <Match
            key={index}
            title={match.title}
            skills={match.skills}
            score={match.score}
          />
        ))}
      </div>
    </div>
  );
}