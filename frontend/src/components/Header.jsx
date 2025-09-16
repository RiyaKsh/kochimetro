import React from 'react'

const Header = () => {
  return (
    // <header className="w-full bg-white   shadow-[0px_4px_4px_0px_#015940] border-b-3 border-[#015940] ">
    <header className="w-full bg-white border-b-3 border-blue ">
      <div className="max-w-7xl mx-auto flex items-center">
        <img 
          src="/logo.png"  
          alt="Logo"
          className="h-16 w-auto"
        />
      </div>
      
    </header>
  )
}

export default Header
