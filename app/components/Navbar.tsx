import React from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Trajectory
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="#features" className="hover:text-blue-500">
              Features
            </Link>
          </li>
          <li>
            <Link href="#waitlist" className="hover:text-blue-500">
              Join Waitlist
            </Link>
          </li>
          <SignedOut>
            <li>
              <SignInButton />
            </li>
          </SignedOut>
          <SignedIn>
            <li>
              <UserButton />
            </li>
          </SignedIn>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
