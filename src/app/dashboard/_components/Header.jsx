'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Navbar from './navbar'

function Header() {
  const path=usePathname();
  useEffect(()=>{
    console.log(path);
 

  },[])
  return (
    <>
     <div>
     <Navbar/>
      <UserButton/>

  
    <header className="bg-[#1a4562] text-white py-4 shadow-md">
        <div className="container mx-auto text-center text-xl font-semibold">
          Mock Interview.io Portal
        </div>
      </header>
     </div>
    
    
    </>
  )
}

export default Header