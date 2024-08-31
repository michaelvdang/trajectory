'use client'
import textLogo from '@/assets/images/TRAJECTORY__4_-removebg-preview.png';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  return ( 
  <footer className="py-0 border-t border-white/15">
    <div className="container">
      <div className="flex flex-col lg:items-center">
        <div className="flex gap-2 items-center lg:flex-1">
          <Image src={textLogo} alt='text' className='size-64'/>
          <div className="font-medium">AI Roadmaps</div>
        </div>

        <nav className="relative flex flex-col lg:flex-row lg:gap-7 gap-5 lg:flex-1 lg:justify-end">
          <a href="#"className="text-white/70 hover:text-white text-xs md:text-sm transition">Developers</a>
          <a href="#"className="text-white/70 hover:text-white text-xs md:text-sm transition">Main Page</a>
        </nav>
      
    </div>
    </div>
  </footer>
  );
};