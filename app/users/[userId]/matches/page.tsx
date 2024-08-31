"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";
import Match from "@/components/Match";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

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
  // query userData and topMatches from firestore
  const [userData, setUserData] = useState<UserData>(null);
  const [topMatches, setTopMatches] = useState<MatchData[]>([]);
  const [targetJobMatches, setTargetJobMatches] = useState<MatchData[]>([]);
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user} = useUser();
  const [userId, setUserId] = useState<string>(null);
  // const userId = searchParams.get("userId");
  const fileName = searchParams.get("fileName");
  const targetJob = searchParams.get("targetJob");

  useEffect(() => {
    if (targetJob) {
      console.log('matches page targetJob: ', targetJob);
      setTargetJobMatches(JSON.parse(localStorage.getItem('targetJobMatches')));
      console.log("JSON.parse(localStorage.getItem('targetJobMatches')): ", JSON.parse(localStorage.getItem('targetJobMatches')));
    }
  }, [targetJob]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUserId(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  // useEffect(() => {
  //   if (userId && fileName) {
  //     handleSuccess(userId as string, fileName as string);
  //   }
  // }, [userId, fileName]);

  // this function should be in upload to be called as soon as the file is uploaded
  const handleSuccess = async (userId: string, fileName: string) => {
    // send filePath (userId, fileName) to parseInit to download from s3
    const response = await fetch(`http://localhost:3000/api/parseInit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, fileName }),
    });
    if (response.ok) {
      console.log("success fully parsed resume");
    }
    const data = await response.json();
    console.log("data from parse response: ", data);
    console.log(JSON.stringify(data));

    setTopMatches(data.topMatches);
    setUserData(data.userData);
  };

  if (targetJobMatches.length === 0 && !userData && topMatches.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

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