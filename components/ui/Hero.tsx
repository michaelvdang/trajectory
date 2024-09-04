'use client';

import Image from 'next/image';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';
import ballImage from '@/assets/images/ball.png';
import textLogo from '@/assets/images/TRAJECTORY__4_-removebg-preview.png';
import { buttonVariants } from './button';
import Link from 'next/link';

export const Hero = () => {
  return (
    <div className="relative py-48 md:py-48 lg:py-48 overflow-hidden"> {/* Reduced height */}
      <div
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent),linear-gradient(to_top,transparent,black_10%,black_70%,transparent)] z-0 max-w-full mx-auto scale-110"> {/* Added scale-110 */}
        <div className="size-[620px] hero-ring"></div>
        <div className="size-[820px] hero-ring"></div>
        <div className="size-[1020px] hero-ring"></div>
        <div className="size-[1220px] hero-ring"></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-0 max-w-full mx-auto scale-110"> {/* Added scale-110 */}
        <Image
          src={ballImage}
          alt="ball"
          width={384}
          height={384}
          className="object-cover opacity-50"
          style={{ animation: 'spin 25s linear infinite' }}
        />
      </div>

      <div className="relative container flex flex-col items-center justify-center min-h-screen z-10">
        <div className="max-w-lg mx-auto text-center scale-110"> {/* Added scale-110 */}
          <h1 className="font-serif text-3xl text-center mt-8 tracking-wide md:text-5xl"></h1>
          <div className="relative flex flex-col -mt-auto py-auto ">
            <Image 
              src={textLogo} 
              alt="text" 
              width={256}
              height={256}
              className="translate-x-1/2 -translate-top-1/2 " 
            />
          </div>
          <p className="text-black/60 md:text-lg tracking-tighter mb-6">
            Transform your career path: upload your resume and get a tailored roadmap to master the skills you need to succeed.
          </p>

          <div className="flex flex-col items-center gap-4 md:flex-row justify-center">
            <Link href="/learn-more" className="inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl">
              <span className="font-semibold">Learn more</span>
              <Image 
                src={ArrowDownIcon}
                alt="Arrow Down"
                width={16}
                height={16}
                className="size-4"
              />
            </Link>

            <Link
              href="/get-started/upload"
              className={buttonVariants({ variant: 'default' })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
