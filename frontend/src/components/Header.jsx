import { LogOut, Search } from "lucide-react";
import React from "react";
import Bell from "../assets/bell.png";
import Profile from "../assets/profile.png";

const Header = () => {
  return (
    <header className="w-full bg-white border-b-3 border-blue flex items-center justify-between px-10">
      <div className=" flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-16 " />
        <div className="flex flex-col ">
          <h1 className="text-xl font-bold text-[#003366]">Sookshma</h1>
          <p className="text-[7px] text-[#003366]">
            Document Intelligence Portal
          </p>
        </div>
      </div>
      <div className="flex items-center ">
        <div className="flex items-center w-full bg-gray-100 rounded-md px-3 py-2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-[500px] bg-transparent outline-none text-sm"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <img src={Bell} alt="bell" className="w-8 h-8" />
        <div className="flex items-center space-x-6">
          <div className="border border-[#003366] flex flex-row items-center p-2 rounded-xl gap-2">
            <img src={Profile} alt="" className="w-6 h-6" />
            <span className="text-sm font-medium ">Admin User</span>
          </div>
          <button className="px-4 py-2 bg-[#003366] cursor-pointer text-white rounded-md flex items-center space-x-2">
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
