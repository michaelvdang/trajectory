"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProfileSection from "@/components/ui/ProfileSection";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { PinnedJobs, UserData, UserDataKey } from "@/types";
import { JobCard } from "@/components/ui/JobCard";
import { Loader } from "lucide-react";
import './styles.css';
import { Footer } from "@/components/ui/Footer";
import Image from "next/image";
import Logo from "@/assets/images/traj_logo_blackR-removebg-preview.png";
import { Header } from '@/components/ui/Header';

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const [targetJob, setTargetJob] = useState<string[] | null>(null);
  const [pinnedJobs, setPinnedJobs] = useState<PinnedJobs | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data().userData as UserData;
          setUserData(userData);
          setTargetJob(userDocSnap.data().targetJob);
          setLoading(false);
          setPinnedJobs(userDocSnap.data().pinnedJobs);
        } else {
          setDoc(userDocRef, { userData: {} });
          alert("Your profile has no data yet. Please upload a resume or fill out the applicable fields.");
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!user || !user.id) {
    return <div>User not found</div>;
  }

  const handleUserDataCallBack = async (field: UserDataKey, items: string[]) => {
    if (userData) {
      userData[field] = items;
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, { userData });
    } else {
      console.error("userData is null or undefined");
    }
  };

  const handleTargetJobCallback = async (items: string[]) => {
    setTargetJob(items);
    const userDocRef = doc(db, "users", user.id);
    await updateDoc(userDocRef, { targetJob: items });
  };

  const updatePinnedJobs = async (pinnedJobs: PinnedJobs) => {
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, { pinnedJobs });
  };

  const togglePinned = async (jobId: string, jobTitle: string) => {
    const newPinnedJobs = { ...pinnedJobs };
    if (newPinnedJobs[jobId]) {
      delete newPinnedJobs[jobId];
    } else {
      newPinnedJobs[jobId] = { id: jobId, title: jobTitle, pinned: true };
    }
    setPinnedJobs(newPinnedJobs);
    updatePinnedJobs(newPinnedJobs);
  };

  return (
    <>
      {/* Header */}
      <Header/>
      <header className="bg-purple-100 p-4 border-b border-black shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Image src={Logo} alt="SaaS Logo" height={150} width={150} />
          </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Pinned Jobs Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-8 text-center text-purple-800">Pinned Jobs</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedJobs && Object.entries(pinnedJobs).length > 0 ? (
              Object.entries(pinnedJobs).map(([id, pinned]) => (
                <div
                  key={id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-dotted border-purple-300"
                  style={{ width: '100%' }} // Adjusted card width
                >
                  <JobCard
                    jobId={id}
                    jobTitle={pinned.title}
                    pinned={pinnedJobs && pinnedJobs[pinned.id] ? true : false}
                    togglePinned={togglePinned}
                  />
                </div>
              ))
            ) : (
              <p className="text-center col-span-full">No pinned jobs</p>
            )}
          </div>
        </section>

        {/* Profile Section */}
        <section>
          <h2 className="text-4xl font-bold mb-8 text-center text-purple-800">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userData ? (
              <>
                {/* Career Goals */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Career Goals"
                    items={targetJob}
                    callback={handleTargetJobCallback}
                  />
                </div>

                {/* Languages */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Languages"
                    items={userData.languages}
                    callback={(items) => handleUserDataCallBack("languages", items)}
                  />
                </div>

                {/* Skills */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Skills"
                    items={userData.skills}
                    callback={(items) => handleUserDataCallBack("skills", items)}
                  />
                </div>

                {/* Experience */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Experience"
                    items={userData.experience}
                    callback={(items) => handleUserDataCallBack("experience", items)}
                  />
                </div>

                {/* Education */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Education"
                    items={userData.education}
                    callback={(items) => handleUserDataCallBack("education", items)}
                  />
                </div>

                {/* Activities */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Activities"
                    items={userData.activities}
                    callback={(items) => handleUserDataCallBack("activities", items)}
                  />
                </div>

                {/* Projects */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Projects"
                    items={userData.projects}
                    callback={(items) => handleUserDataCallBack("projects", items)}
                  />
                </div>

                {/* Certifications */}
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dotted border-purple-300">
                  <ProfileSection
                    title="Certifications"
                    items={userData.certifications}
                    callback={(items) => handleUserDataCallBack("certifications", items)}
                  />
                </div>
              </>
            ) : (
              <Loader />
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
