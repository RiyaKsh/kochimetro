import React from 'react';
import Header from '../components/Header'; // Assuming you have a Header component

// Import your images. These are placeholders; you'll need to add your actual assets.
import dashboardPreview1 from '../assets/dashboard-preview-1.png';
import dashboardPreview2 from '../assets/dashboard-preview-2.png';
import heroIllustration from '../assets/hero-illustration.png';
import docIcon from '../assets/doc-icon.svg';
import complianceIcon from '../assets/compliance-icon.svg';
import aiIcon from '../assets/ai-icon.svg';
import searchIcon from '../assets/search-icon.svg';
import teamIcon from '../assets/team-icon.svg';
import uploadIcon from '../assets/upload-icon.svg';
import organizeIcon from '../assets/organize-icon.svg';
import shareIcon from '../assets/share-icon.svg';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-[#E7EBF5] py-20 px-6 sm:px-10 md:px-20 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="text-center lg:text-left lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-800">
              Sookshma – Smart Document Intelligence for Enterprises
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Organize, track, and review your documents seamlessly with AI insights.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
                Get a Demo
              </button>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
                Get Started
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img src={heroIllustration} alt="Sookshma illustration" className="w-full max-w-lg" />
          </div>
        </div>
      </div>

      {/* --- */}

      {/* Key Features Section */}
      <div className="py-16 px-6 sm:px-10 md:px-20 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10">Key Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Feature Card 1 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <img src={docIcon} alt="Document Icon" className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium text-gray-700 text-center">Document Upload & Management</p>
            </div>
            {/* Feature Card 2 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <img src={complianceIcon} alt="Compliance Icon" className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium text-gray-700 text-center">Compliance Tracking</p>
            </div>
            {/* Feature Card 3 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <img src={aiIcon} alt="AI Icon" className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium text-gray-700 text-center">AI-Generated Summaries & Insights</p>
            </div>
            {/* Feature Card 4 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <img src={searchIcon} alt="Search Icon" className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium text-gray-700 text-center">Smart Search & Filtering</p>
            </div>
            {/* Feature Card 5 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <img src={teamIcon} alt="Team Icon" className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium text-gray-700 text-center">Team Collaboration & Sharing</p>
            </div>
            {/* You can add more features here */}
          </div>
        </div>
      </div>

      {/* --- */}

      {/* How It Works Section */}
      <div className="py-16 px-6 sm:px-10 md:px-20 lg:px-24 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <img src={uploadIcon} alt="Upload icon" className="w-20 h-20 mb-4" />
              <p className="text-lg font-medium text-gray-700">Upload your documents.</p>
            </div>
            {/* Arrow */}
            <div className="text-gray-400 text-4xl hidden md:block">→</div>
            <div className="text-gray-400 text-4xl md:hidden transform rotate-90">→</div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <img src={organizeIcon} alt="Organize icon" className="w-20 h-20 mb-4" />
              <p className="text-lg font-medium text-gray-700">AI organizes & summarizes automatically.</p>
            </div>
            {/* Arrow */}
            <div className="text-gray-400 text-4xl hidden md:block">→</div>
            <div className="text-gray-400 text-4xl md:hidden transform rotate-90">→</div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <img src={shareIcon} alt="Share icon" className="w-20 h-20 mb-4" />
              <p className="text-lg font-medium text-gray-700">Share, review, and approve with your team.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- */}

      {/* Dashboard Preview Section */}
      <div className="py-16 px-6 sm:px-10 md:px-20 lg:px-24 bg-[#1A202C]">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">Dashboard Preview</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative">
              <img src={dashboardPreview1} alt="Dashboard preview 1" className="rounded-xl shadow-2xl border-2 border-gray-700" />
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">Track compliance</div>
            </div>
            <div className="relative">
              <img src={dashboardPreview2} alt="Dashboard preview 2" className="rounded-xl shadow-2xl border-2 border-gray-700" />
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">Review documents faster</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- */}

      {/* Who It's For & Testimonial Section */}
      <div className="py-16 px-6 sm:px-10 md:px-20 lg:px-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Who It's For */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Who It’s For</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <span className="text-center font-medium text-gray-700 bg-gray-200 px-4 py-2 rounded-full">Engineering</span>
                <span className="text-center font-medium text-gray-700 bg-gray-200 px-4 py-2 rounded-full">HR</span>
                <span className="text-center font-medium text-gray-700 bg-gray-200 px-4 py-2 rounded-full">Procurement</span>
                <span className="text-center font-medium text-gray-700 bg-gray-200 px-4 py-2 rounded-full">Finance</span>
                <span className="text-center font-medium text-gray-700 bg-gray-200 px-4 py-2 rounded-full">Legal</span>
                <span className="text-center font-medium text-gray-700 bg-gray-200 px-4 py-2 rounded-full">Safety</span>
              </div>
            </div>
            
            {/* Testimonial */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <blockquote className="text-lg italic text-gray-600">
                “Metro operations reduced review time by 40% using Sookshma.”
              </blockquote>
              <p className="mt-4 text-gray-800 font-semibold">John Smith</p>
              <p className="text-sm text-gray-500">Operations Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- */}

      {/* Security & Compliance Section */}
      <div className="py-16 px-6 sm:px-10 md:px-20 lg:px-24 bg-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10">Security & Compliance Assurance</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-3">🔒</span>
              <p className="font-medium text-gray-700">Data Encryption</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-3">✅</span>
              <p className="font-medium text-gray-700">Role-based Access</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-3">📂</span>
              <p className="font-medium text-gray-700">Secure Cloud Storage</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- */}
      
      {/* Final Call to Action Section */}
      <div className="py-16 px-6 sm:px-10 md:px-20 lg:px-24 bg-blue-600">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to simplify your document management?</h2>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-100 transition duration-300">
              Start Now (Sign up)
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition duration-300">
              Request Demo (Enterprise)
            </button>
          </div>
        </div>
      </div>

      {/* --- */}

      {/* Footer */}
      <footer className="bg-[#1A202C] text-gray-400 py-10 px-6 sm:px-10 md:px-20 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-2xl font-bold text-white">Sookshma</span>
            <p className="text-sm">© 2024 Sookshma Inc.</p>
          </div>
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="hover:text-white transition duration-200">About Sookshma</a>
            <a href="#" className="hover:text-white transition duration-200">Contact Us / Support</a>
            <a href="#" className="hover:text-white transition duration-200">Privacy Policy / Terms</a>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition duration-200">
              {/* LinkedIn Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white transition duration-200">
              {/* Facebook Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition duration-200">
              {/* Twitter/X Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-2.11 1.7-4.52 2.92c-1.39.73-2.91 1.15-4.52 1.25l-2.02.1c-.01 0-.01 0-.01 0c-4.48 0-8.12-3.64-8.12-8.12 0-.01 0-.01.01-.01.1-1.61.52-3.13 1.25-4.52C3.38 2.11 4.35 1 5.4 1h13.2c1.05 0 2.02 1.11 2.92 2.92z"></path></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;