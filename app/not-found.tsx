import { ShieldOff } from 'lucide-react'
import React from 'react'

const NotFound = () => {
    return (
        <main className='flex flex-col gap-24 px-8 md:px-24'>
            <div className='min-h-[50vh] flex flex-col gap-4 items-center justify-center mt-40  '>
                <ShieldOff size={100} />
                <h2 className="text-center text-4xl max-w-5xl leading-relaxed md:text-5xl">
                    Sorry, The page you 
                    <br />
                    are trying to look is
                    <br />
                    <span className='text-red-500 uppercase font-semibold animate-pulse'> 404 - not found !</span>
                </h2>
            </div>
      </main>
      
  )
}

export default NotFound