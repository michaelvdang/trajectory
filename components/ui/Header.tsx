"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/get-started/upload");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex justify-center items-center fixed top-3 w-full z-10">
      <nav className="flex gap-1 p-0.5 border border-violet-300/15 bg-neutral-400/10 backdrop-blur rounded-full">
        <Link href="/" className="nav-item text-violet-900 hover:text-gray-600">
          Home
        </Link>
        <Link
          href="/about"
          className="nav-item text-violet-900 hover:text-gray-600"
        >
          About
        </Link>
        <SignedOut>
          <Link
            href="/waitlist/join"
            className="nav-item text-violet-900 hover:text-gray-600"
          >
            Join Waitlist
          </Link>
          <Link
            href="#"
            className="nav-item text-violet-900 hover:text-gray-600"
          >
            <SignInButton />
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            href="/JobDashboard"
            className="nav-item text-violet-900 hover:text-gray-600"
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="nav-item text-violet-900 hover:text-gray-600"
          >
            Profile
          </Link>
          <UserButton />
        </SignedIn>
      </nav>
    </div>
  );
};
