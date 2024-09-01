"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";
import { Header } from "@/components/ui/Header";
import ProfileSection from "@/components/ui/ProfileSection";

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
        try {
          const response = await fetch(`/api/user?userId=${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("data: ", data);

          if (data) {
            const userData: User = {
              targetJob: data.targetJob,
              ...data, // Assuming the rest of the fields are directly in the response
            };
            setUser(userData);
          } else {
            setUser(null);
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (!userId) {
    return <div>Missing userId parameter</div>;
  }

  return (
    <>
      <Header />
      <div className="py-24 relative z-0 overflow-x-clip">
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ProfileSection title="Target Job" items={[user.targetJob]} userId={userId} />
            <ProfileSection title="Languages" items={user.languages} userId={userId} />
            <ProfileSection title="Skills" items={user.skills} userId={userId} />
          </div>
          <div>
            <ProfileSection title="Experience" items={user.experience} userId={userId} />
            <ProfileSection title="Education" items={user.education} userId={userId} />
            <ProfileSection title="Activities" items={user.activities} userId={userId} />
            <ProfileSection title="Projects" items={user.projects} userId={userId} />
            <ProfileSection title="Certifications" items={user.certifications} userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
}