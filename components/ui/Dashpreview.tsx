'use client';

import Image from 'next/image';
import Preview from '@/assets/images/dashboard preview.png';


export const DashPreview = () => {
  return (
     <section className="bg-black py-24 overflow-x-clip">
      <div className="container">
        <div className="max-w-2xl mx-auto px-4 py-8 relative">
        <h2 className="text-4xl md:6xl font-bold tracking-tighter bg-gradient-to-b from-white to-violet-300 text-transparent bg-clip-text mt-6 text-center"> Expertly Crafted </h2>
        <p className="text-xl text-[#a47bc4] tracking-tight mt-5 text-center">The Expert Dashboard customizes recommendations based on your job choice, offering real-time insights and targeted resources to help you stay on track and advance in your career. Get the right support for your professional journey and achieve your goals with ease. 
        </p>
        
        </div>
        <div className="flex gap-2 mt-10 justify-center">
        
            <Image 
                  src={Preview}
                  alt="Dashboard Preview"
                  
                  className="mx-auto rounded-lg shadow-lg border border-white shadow-violet-300/15" 
                />
           
        </div>
      </div>
     </section>
  
  );
};