'use client';

import Image from 'next/image';
import Logo from "@/assets/images/traj_logo_blackR-removebg-preview.png";
import Link from 'next/link';
import { Footer } from "@/components/ui/Footer";
import { Header } from '@/components/ui/Header';
import ArrowRight from '@/assets/icons/arrow-right.svg';

export default function AboutPage() {
  return (
    <>
     <Header/>
      <header className="bg-purple-100 p-4 border-b border-black shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Image src={Logo} alt="SaaS Logo" height={150} width={150} />
          </div>
      </header>
    <section className="bg-gradient-to-br from-black via-purple-900 to-black py-24 overflow-x-clip">
      <div className="container">
       

        {/* Background Section */}
        <div className="max-w-2xl mx-auto px-4 py-8 relative">
            <div className="border-b border-white/50">
            <h1 className="text-5xl md:text-6xl font-bold underline tracking-tighter bg-gradient-to-b from-white to-violet-300 text-transparent bg-clip-text mt-6 text-center">
                ABOUT
            </h1>
            </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-violet-300 text-transparent bg-clip-text mt-6 text-center">
            Background
          </h2>
          <p className="text-xl text-[#a47bc4] tracking-tight mt-5 text-center">
            Trajectory helps you achieve your dream job by creating a personalized roadmap based on your resume or career aspirations. With a focus on skills and milestones, we provide guidance for a clearer path to success.
          </p>
        </div>

        {/* Video Section */}
        <div className="flex gap-2 mt-10 justify-center">
          <div className="mx-auto rounded-lg shadow-lg border border-white shadow-violet-300/15">
            <video 
              src="/path-to-your-video.mp4"  // Replace with your actual video path
              controls 
              className="rounded-lg w-full max-w-3xl"
            />
          </div>
        </div>

        {/* Architecture Section */}
        <div className="max-w-2xl mx-auto px-4 py-8 relative">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-violet-300 text-transparent bg-clip-text mt-6 text-center">
            Architecture
          </h2>
          <p className="text-xl text-[#a47bc4] tracking-tight mt-5 text-center">
            Our platform leverages modern technologies to deliver precise, data-driven career recommendations. By analyzing your resume and goals, we generate a tailored roadmap to ensure you acquire the skills necessary for your dream job.
          </p>
        </div>

        {/* Additional Sections */}
        <div className="max-w-2xl mx-auto px-4 py-8 relative">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-violet-300 text-transparent bg-clip-text mt-6 text-center">
            Vision
          </h2>
          <p className="text-xl text-[#a47bc4] tracking-tight mt-5 text-center">
            At Trajectory, we envision a future where everyone has a clear, actionable path to achieve their dream career. Our platform adapts to your changing goals, providing real-time support every step of the way.
          </p>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-8 relative">
            <a href="https://linktr.ee/Trajectory.AI">
                <div className="flex justify-center items-center gap-2 mt-6 text-white">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-violet-300 text-transparent bg-clip-text">
                    Meet The Team ➜
                </h2>
                
                </div>
            </a>
            </div>

      </div>
      <div className="max-w-2xl mx-auto px-4 py-8 relative">
            <a href="https://forms.gle/66oRtgHtoMvuReQ3A">
                <div className="flex justify-center items-center gap-2 mt-6 text-white">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-violet-300 text-transparent bg-clip-text">
                    Give Feedback ➜
                </h2>
               
                </div>
                <p className="text-xl text-[#a47bc4] tracking-tight mt-5 text-center">
            Your opinion matters. Let us know what you think!
                </p>
            </a>
            

      </div>
    </section>
    <Footer />
    </>
  );
};
