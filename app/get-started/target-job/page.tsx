'use client'
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Header } from '@/components/ui/Header'
import { Input } from '@/components/ui/input'
import { db } from '@/firebase'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { doc, writeBatch } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MatchData } from "@/types";
import { Footer } from '@/components/ui/Footer';

const TargetJobPage = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const [targetJob, setTargetJob] = useState<string>('')
  const router = useRouter()
  const [isTargetJobSubmitted, setIsTargetJobSubmitted] = useState<boolean>(false)

  const handleSubmitTargetJob = async (targetJob: string) => {
    localStorage.setItem('targetJob', targetJob);
    if (targetJob.length === 0) {
      alert('Please enter a job title');
      return;
    }
    if (!isLoaded || !isSignedIn) {
      alert('Please sign in to continue');
      return;
    }
    setIsTargetJobSubmitted(true);
    try {
      const response = await axios.post(
        `/api/search`, 
        {targetJob},
        // { "message": JSON.stringify({targetJob}) }, 
        { headers: { 'Content-Type': 'application/json' } }
      )
      // store in local storage
      const targetJobMatches : MatchData[] = response.data.matches.map((match: any) => (
        {
          title: match.metadata.title,
          skills: match.metadata.skills,
          score: match.score,
          id: match.id,
          description: match.metadata.description,
          timeline: match.metadata.timeline,
          salary: match.metadata.salary,
          location: match.metadata.location,
        }
      ))
      localStorage.setItem('targetJobMatches', JSON.stringify(targetJobMatches));

      console.log("store in firestore")
      // save targetJob to firestore and targetJobMatches to firestore
      const userDocRef = doc(db, 'users', user.id);
      // await setDoc(userDocRef, {targetJob, targetJobMatches}, { merge: true });
      const batch = writeBatch(db)
      batch.set(userDocRef, {targetJob: [targetJob], targetJobMatches}, { merge: true });
      await batch.commit();

      router.push(`/users/${user.id.slice(-10)}/matches`);
    }
    catch (error) {
      console.log('handleSubmitTargetJob error: ', error);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitTargetJob(targetJob);
    }
  };

  if (!isLoaded) {
    return (<Loader />)
  }
  
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center py-12 bg-white">
        <div className="max-w-7xl w-full flex flex-col items-center">
          <div className="flex justify-center items-center pt-16 pb-12">
            <h1 className="text-4xl font-bold mb-6 text-black">
              What&apos;s Your Dream Job?
            </h1>
          </div>
          {isTargetJobSubmitted ? (
            <>
              <Loader />
            </>
          ) : (
            <div className="relative flex flex-col justify-center items-center gap-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-12 md:p-24 w-11/12 md:w-3/4 border border-purple-300 shadow-lg max-w-xl md:max-w-3xl mx-auto">
              <Input
                className="outline-dashed outline-2 outline-purple-300"
                placeholder="Enter Job Title"
                onChange={(e) => setTargetJob(e.target.value)}
                value={targetJob}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
          <div className="max-w-xl md:max-w-3xl py-12 px-12 md:px-24 w-full flex justify-between gap-6 mt-8">
            <Link
              href="/get-started/upload"
              className="text-purple-800 hover:text-purple-900 transition-colors"
            >
              Prev
            </Link>
            {targetJob.length > 0 ? (
              <Button
                onClick={() => handleSubmitTargetJob(targetJob)}
                className="bg-purple-800 text-white hover:bg-purple-900 transition-colors"
                variant="default"
              >
                Next
              </Button>
            ) : (
              <Button
                disabled
                className="bg-gray-400 text-white cursor-not-allowed"
                variant="default"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
  
}

export default TargetJobPage