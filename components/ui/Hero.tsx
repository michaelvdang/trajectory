'use client';

import Image from 'next/image';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';
import ballImage from '@/assets/images/ball.png';
import textLogo from '@/assets/images/TRAJECTORY__4_-removebg-preview.png';

export const Hero = () => {
  return (
    <div className="py-96 md:py-96 lg:py-96 relative z-0 overflow-x-clip">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
        <div className="size-[620px] hero-ring"></div>
        <div className="size-[820px] hero-ring"></div>
        <div className="size-[1020px] hero-ring"></div>
        <div className="size-[1220px] hero-ring"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={ballImage}
            alt="ball"
            width={384}
            height={384}
            className="object-cover opacity-50"
            style={{ animation: 'spin 25s linear infinite', zIndex: -1 }}
          />
        </div>

        <div className="container flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="font-serif text-3xl text-center mt-8 tracking-wide md:text-5xl"></h1>
            <div className="relative flex flex-col -mt-auto py-auto">
              <Image 
                src={textLogo} 
                alt="text" 
                width={256}
                height={256}
                className="translate-x-1/2 -translate-top-1/2" 
              />
            </div>
            <p className="text-black/60 md:text-lg tracking-tighter mb-6">
              Transform your career path: upload your resume and get a tailored roadmap to master the skills you need to succeed.
            </p>

            <div className="flex flex-col items-center gap-4 md:flex-row justify-center">
              <button className="inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl">
                <span className="font-semibold">Learn more</span>
                <Image 
                  src={ArrowDownIcon}
                  alt="Arrow Down"
                  width={16}
                  height={16}
                  className="size-4"
                />
              </button>

              <button className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-12 px-6 rounded-xl hover:bg-violet-500/30 hover:text-gray-600">
                <span className="font-semibold">Get Started</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};