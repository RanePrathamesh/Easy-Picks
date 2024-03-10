"use client"
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

 const Progressbar = () => {
    const [progress,setProgress]=useState(0)
    useEffect(()=>{
        const interval=setInterval(()=>{
            setProgress(prevProgress=>(
              prevProgress>=100 ?0:prevProgress+10
            ))
        },400)
        return ()=>{
            clearInterval(interval)
        }
    },[])
    console.log(progress)
  return (
    <div className='w-full h-[3px] z-100 fixed bg-white top-0 left-0'>
    <div style={{width:`${progress}%`}} className={`transition-all duration-700 bg-primary ease-in-out h-full `} />
    <div className='h-5 w-5 absolute top-0 right-4 rounded-full border-2 border-primary animate-spin'></div>
    </div>
  )
}
export default Progressbar
