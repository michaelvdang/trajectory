'use client'
import React from 'react';
import textLogo from '@/assets/images/Untitled_design-removebg-preview.png';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-purple-300">
      <div className="container mx-auto flex flex-col lg:flex-row lg:items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex gap-2 items-center mb-6 lg:mb-0">
          <Image src={textLogo} alt="AI Roadmaps Logo" height={150} width={150}  />
          <div className="font-medium text-lg text-purple-300">AI Roadmaps</div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col lg:flex-row lg:gap-7 gap-4 text-center lg:text-left">
          <a href="https://forms.gle/66oRtgHtoMvuReQ3A" className="text-white/70 hover:text-purple-300 text-sm transition">
            Feedback
          </a>
          <Link href="/" className="text-white/70 hover:text-purple-300 text-sm transition">
            Main Page
          </Link>
          <Link href="#" className="text-white/70 hover:text-purple-300 text-sm transition">
            Privacy Policy
          </Link>
          <Link href="#" className="text-white/70 hover:text-purple-300 text-sm transition">
            Terms of Service
          </Link>
          <a href="https://linktr.ee/Trajectory.AI" className="text-white/70 hover:text-purple-300 text-sm transition">
            Know the Team
          </a>
        </nav>
      </div>

      <div className="container mx-auto text-center mt-8">
        <p className="text-xs text-white/60">&copy; 2024 Trajectory. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;