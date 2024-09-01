"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";
import admin from '@/firebaseAdmin';

interface User {
  targetJob: string;
  languages: string[];
  skills: string[];
  experience: string[];
  education: string[];
  activities: string[];
  projects: string[];
  certifications: string[];
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userDocRef = admin.firestore().doc('users/' + userId);
        const userDoc = await userDocRef.get();

        const data = userDoc.data();
        console.log("data: ", data);
        if (data) {
            const userData: User = {
                targetJob: data.targetJob,
                ...data.userData, // Assuming the map is under the 'details' field
              };
              setUser(userData);
        } else {
            // If the user is not found, set the user to null
            setUser(null);
            console.log("User not found");
        }
        
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return user && !loading ? (
    <Profile
      languages={user.languages}
      skills={user.skills}
      experience={user.experience}
      education={user.education}
      activities={user.activities}
      projects={user.projects}
      certifications={user.certifications}
    />
  ) : (
    <div>Loading</div>
  );
}