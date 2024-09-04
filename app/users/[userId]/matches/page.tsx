"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";
import Match from "@/components/Match";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import axios from "axios";
import { JobGrid } from "@/components/ui/JobGrid";
import { JobCard } from "@/components/ui/JobCard";
import { db } from "@/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Header } from "@/components/ui/Header";
import { MatchData, PinnedJobs, UserData } from "@/types";



export default function Jobs() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const [targetJob, setTargetJob] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const fileName = searchParams.get("fileName");
  const [pinnedJobs, setPinnedJobs] = useState<PinnedJobs | null>(null);

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
          setPinnedJobs(data.pinnedJobs);
        }
      });
      return () => unsubscribe();
    }
  }, [isLoaded, isSignedIn, user]);
  
  useEffect(() => {
    if (targetJob) {
      const targetJobMatchesString = localStorage.getItem('targetJobMatches');
      const targetJobMatches = JSON.parse(targetJobMatchesString || '[]');
      setTargetJobMatches(targetJobMatches);
    }
  }, [targetJob]);

  useEffect(() => {
    if (topMatches && topMatches.length > 0) {
      localStorage.setItem('topMatches', JSON.stringify(topMatches));
    }
  }, [topMatches]);

  // set pinned jobs
  const updatePinnedJobs = async (pinnedJobs: PinnedJobs) => {
    if (isLoaded && isSignedIn && user) {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        pinnedJobs: pinnedJobs
      });
    }
  }

  const togglePinned = async (jobId: string, jobTitle: string) => {
    const newPinnedJobs = { ...pinnedJobs };
    if (newPinnedJobs[jobId]) {
      delete newPinnedJobs[jobId];
    } else {
      newPinnedJobs[jobId] = { id: jobId, title: jobTitle, pinned: true };
    }
    setPinnedJobs(newPinnedJobs);
    updatePinnedJobs(newPinnedJobs);
  }
  
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

  if (isLoaded && !isSignedIn) {
    return (
      <RedirectToSignIn redirectUrl="/users/1/matches"/>
    );
  }

  return (
    <>
    <Header />
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
                jobId={job.id}
                jobTitle={job.title}
                jobDescription={job.description || "No description available"}
                timeline={job.timeline || "No timeline available"}
                salary={job.salary || "No salary available"}
                difficulty={"No difficulty available"}
                pinned={pinnedJobs && pinnedJobs[job.id] ? true : false}
                togglePinned={togglePinned}
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
                jobId={job.id}
                jobTitle={job.title}
                jobDescription={job.description || "No description available"}
                timeline={job.timeline || "No timeline available"}
                salary={job.salary || "No salary available"}
                difficulty={"No difficulty available"}
                // skills={job.skills}
                // score={job.score}
                pinned={pinnedJobs && pinnedJobs[job.id] ? true : false}
                togglePinned={togglePinned}
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
  </>
  )
}