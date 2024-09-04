"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";
import { Header } from "@/components/ui/Header";
import ProfileSection from "@/components/ui/ProfileSection";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { setUserId } from "firebase/analytics";
import { PinnedJobs, UserData, UserDataKey } from "@/types";
import { JobCard } from "@/components/ui/JobCard";
import './styles.css';
import { Loader } from "lucide-react";

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const [targetJob, setTargetJob] = useState<string[] | null>(null);
  const [pinnedJobs, setPinnedJobs] = useState<PinnedJobs | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // fetch user data from firestore
      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data().userData as UserData;
          setUserData(userData);
          setTargetJob(userDocSnap.data().targetJob);
          console.log('userdocksnap.data(): ', userDocSnap.data());
          setLoading(false);
          setPinnedJobs(userDocSnap.data().pinnedJobs);
        }
        else {
          setDoc(userDocRef, { userData: {} });
          alert('Your profile has no data yet. Please upload a resume or fill out the applicable fields.');
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (!user.id) {
    return <div>Missing userId parameter</div>;
  }

  const handleUserDataCallBack = async (field: UserDataKey, items: string[]) => {
    if (userData) {
      console.log("field: ", field);
      console.log("items: ", items);
      userData[field] = items;
      console.log("userData: ", userData);
      const userId = user.id;
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { userData });
    }
    else {
      console.error("userData is null or undefined");
    }
  };

  const handleTargetJobCallback = async (items: string[]) => {
    setTargetJob(items);
    const userId = user.id;
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { targetJob: items });
  };

  // set pinned jobs
  const updatePinnedJobs = async (pinnedJobs: PinnedJobs) => {
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, {
      pinnedJobs: pinnedJobs
    });
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

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-24 relative z-0 overflow-x-clip">

        {/* Pinned jobs section  */}
        <div 
          
        >
          <div
            className="flex justify-center"
          >
            <h2
              className="text-3xl font-bold mb-4"
            >
              Pinned Jobs
            </h2>
          </div>
          <div className="mx-auto p-4 flex">
            <div className="w-full flex flex-wrap gap-x-4">
              {pinnedJobs ? (
                Object.entries(pinnedJobs).map(([id, pinned]) => (
                  <div
                    key={id}
                    className="card-container w-full  mb-4 "
                  >
                    <JobCard
                      key={id}
                      jobId={id}
                      jobTitle={pinned.title}
                      // jobDescription={job.description || "No description available"}
                      // timeline={job.timeline || "No timeline available"}
                      // salary={job.salary || "No salary available"}
                      // difficulty={"No difficulty available"}
                      pinned={pinnedJobs && pinnedJobs[pinned.id] ? true : false}
                      togglePinned={togglePinned}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center">No pinned jobs</p>
              )}
              {/* <ProfileSection title="Jobs" items={targetJob} callback={(items) => handleTargetJobCallback(items)} /> */}
            </div>
          </div>
        </div>

        
        {/* Profile section  */}
        <div 
          
        >
          <div
            className="flex justify-center"
          >
            <h2
              className="text-3xl font-bold mb-4"
            >
              Your Profile
            </h2>
          </div>
          <div className="mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData ? (
            <>
              <div>
                <ProfileSection title="Career Goals" items={targetJob} callback={(items) => handleTargetJobCallback(items)} />
                <ProfileSection title="Languages" items={userData.languages} callback={(items) => handleUserDataCallBack('languages', items)} />
                <ProfileSection title="Skills" items={userData.skills} callback={(items) => handleUserDataCallBack('skills', items)} />
              </div>
              <div>
                <ProfileSection title="Experience" items={userData.experience} callback={(items) => handleUserDataCallBack('experience', items)} />
                <ProfileSection title="Education" items={userData.education} callback={(items) => handleUserDataCallBack('education', items)} />
                <ProfileSection title="Activities" items={userData.activities} callback={(items) => handleUserDataCallBack('activities', items)} />
                <ProfileSection title="Projects" items={userData.projects} callback={(items) => handleUserDataCallBack('projects',items)} />
                <ProfileSection title="Certifications" items={userData.certifications} callback={(items) => handleUserDataCallBack('certifications', items)} />
              </div>
            </>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    </>
  );
}