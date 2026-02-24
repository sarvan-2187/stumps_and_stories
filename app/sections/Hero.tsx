'use client';

import { BackgroundLines } from '@/components/ui/background-lines';
import React from 'react';

const Hero = () => {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-black -z-999">
      <div className="flex flex-col gap-8 md:py-2 items-center justify-center z-100">

        {/* Tag */}
        <div className='text-xs border border-cyan-100/30 p-2 rounded-2xl bg-cyan-900/50'>
          <p>The #OG Newsletter</p>
        </div>

        {/* Heading */}
        <div className='flex flex-col gap-8'>
          <h1 className="text-4xl md:text-6xl text-center">
            <span className='italic'>Welcome to </span><br />
            <span className='text-5xl md:text-7xl font-serif font-extrabold'>
              Stumps & Stories!
            </span><br />
            <span className='text-2xl md:text-4xl font-serif font-medium'>
              Get Ready to Experience Cricket beyond the scoreboard...
            </span>
          </h1>
        </div>

        {/* Maintenance Box */}
        <div className='flex flex-row gap-2 z-10 bg-cyan-900/50 p-6 rounded-md border border-cyan-700 max-w-md text-center'>
          <p className="text-white text-sm md:text-base">
            Newsletter subscription is currently under maintenance. <br />
            We are working on improving the experience. Please check back soon!
          </p>
        </div>

      </div>
    </BackgroundLines>
  );
};

export default Hero;
