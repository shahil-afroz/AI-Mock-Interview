'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
  const path=usePathname();
  useEffect(()=>{
    console.log(path);
 

  },[])
  return (
    <>
    <div className='flex flex-row p-4 justify-between items-center bg-secondary shadow-lg'>
      <Image src={'/logo.svg'} width={160} height={130} alt='logo'/>
      <ul className='flex p-3 gap-5'>
        <li className='hover:text-violet-700 hover:font-bold transition-all cursor-pointer'>Dashboard</li>
        <li className='hover:text-violet-700 hover:font-bold transition-all cursor-pointer'>Questions</li>
        <li className='hover:text-violet-700 hover:font-bold transition-all cursor-pointer'>Upgrade</li>
        <li className='hover:text-violet-700 hover:font-bold transition-all cursor-pointer'>How it Works?</li>
      </ul>
      <UserButton/>

    </div>
    <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto text-center text-xl font-semibold">
          Mock Interview.io Portal
        </div>
      </header>
    
    </>
  )
}

export default Header