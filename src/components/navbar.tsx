import React from 'react'
import { Button } from './ui/button'

function Navbar() {
  return (
    <div>
      <nav className="sticky top-0  shadow-sm z-50 bg-[#232a34]">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between h-20">
    {/* Logo */}
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-[#01a2e9] rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
        <span className="text-white text-xl font-bold">F</span>
      </div>
      <span className="text-xl font-bold text-white">
        Master Your Interviews
      </span>
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex items-center space-x-8">
      {["Home", "About", "Services", "Contact"].map((link) => (
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          className="text-white hover:text-blue-600 transition-colors duration-300 text-xl uppercase tracking-wider"
        >
          {link}
        </a>
      ))}
      <Button
        className="bg-[#232a34] hover:bg-blue-800 text-blue-400 text-xl px-4 py-1 rounded-sm border-b-2 border-[#106c99] font-medium uppercase tracking-wider"
      >
        Get Started
      </Button>
    </div>

    {/* Mobile menu button */}
    <div className="md:hidden">
      <Button
        className="text-gray-600 hover:text-blue-600 focus:outline-none"
        variant="ghost"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>
    </div>
  </div>
</div>
</nav>
    </div>
  )
}

export default Navbar
