import Image from 'next/image'
import React from 'react'

export default function Tags({tag}) {
  return (
    <div className='bg-col-tag w-max-content text-white font-inter text-base font-semibold justify-center flex items-center gap-2 py-1.5 px-2.5  transform -translate-y-1/2 rounded-tr-md rounded-br-md absolute left-[-10px]  z-10 after:block  after:border-r-[9px] after:border-b-[9px] after:absolute after:bottom-[-9px] after:left-0 after:border-t-transparent after:border-r-black after:border-b-transparent after:border-l-transparent' >
        <Image
         src={"https://www.svgrepo.com/show/211425/trophy-award.svg"}
         width={18} 
         height={18}
         alt='award'
         style={{ filter: 'invert(1)' }}
        />
        {tag}
    </div>
  )
}
