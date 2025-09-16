import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardHeader = () => {
  
  const handleLogout = () => {
    toast.success('Logging out...');
    
    setTimeout(() => {
      localStorage.removeItem('authToken'); // Clear auth data
      window.location.href = '/';          // Redirect to login
    }, 1500);  // Wait 1.5 seconds so toast is visible
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <header className="w-full  border-b-4 border-[#015940]">
        <div className="max-w-7xl mx-auto flex items-center justify-between ">
          <div className="flex items-center">
            <img 
              src="/logo.png"  
              alt="Logo"
              className="h-16 w-auto"
            />
          </div>

          <button
            onClick={handleLogout}
            className="bg-[#015940] text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Log out
          </button>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
