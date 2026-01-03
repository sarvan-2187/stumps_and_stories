import { BackgroundLines } from '@/components/ui/background-lines'
import React from 'react'

const Hero = () => {
    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-black -z-999" >
        <div className="flex flex-col gap-8 md:py-2 items-center justify-center z-100">
            <div className='text-xs border border-cyan-100 p-2 rounded-2xl bg-cyan-900/50'>
                <p>The OG Newsletter</p>
            </div>
            <div className='flex flex-col gap-8'>
                <h1 className=" text-4xl md:text-7xl text-center animate-pulse">Hello, Welcome to Stumps & Stories!</h1>
                <h5 className='text-center'>Subscribe to get latest news about the cricket world...</h5>
            </div>
            <div className='flex flex-row gap-2 z-10 bg-cyan-900/50 p-2 rounded-md border border-cyan-700'>
                <input
                    type="email"
                    className="w-50 border border-cyan-900 hover:border-cyan-400 focus:border-cyan-300 focus:outline-none rounded-md h-8 px-4 transition-all duration-300 ease-in-out"
                />
                <button type='submit' className='cursor-pointer h-8 px-4 bg-white/70 text-black rounded-md hover:bg-white transition-all duration-500'>
                    Subscribe
                </button>
            </div>
            <div>    
        </div>
        </div>
    </BackgroundLines>
  )
}

export default Hero