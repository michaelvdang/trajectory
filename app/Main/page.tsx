'use client';
// import { HeadComp } from "@/components/HeadComp";
{/*
import React, { useState } from 'react';
import Image from 'next/image';
import textLogo from '@/assets/images/TRAJECTORY__4_-removebg-preview.png';


const ScoreBar = () => {
    // Define state to keep track of checkboxes and checked count
    const [checkedCount, setCheckedCount] = useState(0);

    // Array of checkbox data
    const checkboxes = [
        { id: 1, label: 'Option 1' },

        { id: 2, label: 'Option 2' },
        { id: 3, label: 'Option 3' },
        { id: 4, label: 'Option 4' },
    ];

    // Total number of checkboxes
    const totalCheckboxes = checkboxes.length;

    // Handle checkbox change event
    const handleCheckboxChange = (event) => {
        if (event.target.checked) {
            setCheckedCount(checkedCount + 1);
        } else {
            setCheckedCount(checkedCount - 1);
        }
    };

    // Calculate percentage of checkboxes ticked
    const percentage = (checkedCount / totalCheckboxes) * 100;

    return (
        <>
            <HeadComp />
            <section className="bg-gradient-to-br from-slate-50 via-violet-100 to-slate-50 p-4 relative overflow-hidden">
                {/* Rings background 
                <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
                    <div className="w-[620px] h-[620px] hero-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-[820px] h-[820px] hero-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-[1020px] h-[1020px] hero-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-[1220px] h-[1220px] hero-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="relative py-96 md:py-96 lg:py-96 z-10">
                    <div className="p-4 w-full max-w-2xl mx-auto bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg border border-violet-300/35 shadow-[0_0_80px_inset] shadow-violet-300/50">
                        <div className="relative flex flex-col -mt-auto py-auto">
                            <Image src={textLogo} alt="text" className="size-64 translate-x-1 -translate-top-1/2" />
                        </div>

                        {/* Render checkboxes 
                        <div className="bg-black text-white rounded-lg py-4 px-4 flex flex-col gap-2 border border-violet-300/35 shadow-[0_0_80px_inset] shadow-violet-300/50">
                            {checkboxes.map((checkbox) => (
                                <div
                                    key={checkbox.id}
                                    className="flex items-center justify-between p-2 rounded-md transition-colors duration-300 bg-gray-800 hover:bg-gray-600"
                                >
                                    <label htmlFor={`checkbox-${checkbox.id}`} className="cursor-pointer">
                                        {checkbox.label}
                                    </label>
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${checkbox.id}`}
                                        onChange={handleCheckboxChange}
                                        className="cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Render progress bar 
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-width duration-300"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>

                        {/* Display percentage 
                        <p className="mt-2 text-sm text-white">{`${checkedCount} out of ${totalCheckboxes} options selected (${percentage.toFixed(1)}%)`}</p>
                    </div>
                </div>
            </section>
        </>
    );
};


export default ScoreBar; */}

import React from 'react';
import { JobGrid } from '@/components/ui/JobGrid';

export default function Home() {
    return (
  <>
  <div className="bg-black">
  {/* Background rings */}
  <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
      <div className="w-[620px] h-[620px] hero-ring"></div>
      <div className="w-[820px] h-[820px] hero-ring"></div>
      <div className="w-[1020px] h-[1020px] hero-ring"></div>
      <div className="w-[1220px] h-[1220px] hero-ring"></div>
    </div>

    <JobGrid />
    </div>
  </>
);
};


