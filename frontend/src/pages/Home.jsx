//gptcode
import React from 'react'
import { useNavigate } from 'react-router-dom'
import metroMap from '../assets/metroMap.png';
import Header from '../components/Header';
const Home = () => {
  const navigate = useNavigate();

  const goToPageOne = () => {
    navigate('/login'); // replace with your route
  }

  const goToPageTwo = () => {
    navigate('/loginWorker'); // replace with your route
  }

  return (
    <div>
      <Header/>
    <div className="flex flex-col ">
      {/* Hero Section */}
      <div className="w-full max-w-5xl mx-auto mt-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-left">
          Transforming Document{" "}
          <span className="text-[#015940]">Chaos</span> into{" "}
          <span className="text-[#015940]">Clarity</span>
        </h1>
        <p className="text-gray-600 mt-4 text-sm sm:text-base md:text-lg text-left max-w-3xl">
          Smart, multilingual, automated solution for KMRL's document overload.
          Workflows, ensure compliance, and preserve knowledge.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-start mt-8 gap-4">
          <button
            onClick={goToPageOne}
            className="bg-[#015940] text-white px-6 py-3 rounded-md w-full sm:w-auto transition duration-300 hover:bg-[#01432e] flex items-center justify-center"
          >
            Admin Login →
          </button>

          <button
            onClick={goToPageTwo}
            className="border border-[#015940] text-[#015940] px-6 py-3 rounded-md w-full sm:w-auto transition duration-300 hover:bg-[#f1fdf8] flex items-center justify-center"
          >
            Worker Login →
          </button>
        </div>
      </div>

      {/* Metro Map Section */}
      <div className="mt-12 w-full max-w-5xl mx-auto">
        <img
          src={metroMap}
          alt="Kochi Metro Map"
          className="rounded-xl shadow-lg w-full object-contain"
        />
      </div>
     <div className="py-16 px-6 text-center">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Powerful Features</h2>
      <p className="text-gray-500 mb-12">
        Everything you need to manage documents efficiently
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Smart Search */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
          <p className="text-gray-500 text-sm">
            AI-powered multilingual search across all documents
          </p>
        </div>

        {/* Department Dashboards */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Department Dashboards</h3>
          <p className="text-gray-500 text-sm">
            Real-time insights for each department&apos;s document flow
          </p>
        </div>

        {/* Compliance Tracker */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Compliance Tracker</h3>
          <p className="text-gray-500 text-sm">
            Never miss deadlines with automated compliance monitoring
          </p>
        </div>

        {/* Knowledge Retention */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Knowledge Retention</h3>
          <p className="text-gray-500 text-sm">
            Preserve institutional knowledge with smart archiving
          </p>
        </div>

        {/* Collaboration */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaboration</h3>
          <p className="text-gray-500 text-sm">
            Seamless document sharing across departments
          </p>
        </div>
      </div>
    </div>
    <div className="py-16 px-6 text-center">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
      <p className="text-gray-500 mb-12">
        Simple three-step process to transform your document workflow
      </p>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#015940] flex items-center justify-center text-white text-2xl font-bold mb-4">
            01
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload</h3>
          <p className="text-gray-500 text-sm">
            Drag &amp; drop documents with auto-OCR processing
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#015940] flex items-center justify-center text-white text-2xl font-bold mb-4">
            02
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Summarize</h3>
          <p className="text-gray-500 text-sm">
            Intelligent extraction of key points and action items
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#015940] flex items-center justify-center text-white text-2xl font-bold mb-4">
            03
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Route &amp; Notify</h3>
          <p className="text-gray-500 text-sm">
            Smart routing to relevant departments with notifications
          </p>
        </div>
      </div>
    </div>
    <footer className="bg-[#015940] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section - Logo & Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {/* Logo (placeholder text, replace with SVG if you have one) */}
            <span className="text-2xl font-bold">KMRL</span>
            <span className="text-sm">Document Intelligence Portal</span>
          </div>
          <p className="text-sm text-gray-200">
            Kochi Metro Rail Limited  
            <br />
            Transforming urban transportation through technology
          </p>
        </div>

        {/* Middle Section - Contact Info */}
        <div>
          <h4 className="font-semibold mb-3">Contact Information</h4>
          <p className="text-sm text-gray-200">Email: support@kmrl.co.in</p>
          <p className="text-sm text-gray-200">Phone: +91 123456789</p>
          <p className="text-sm text-gray-200">Address: KMRL House, Cochin</p>
        </div>

        {/* Right Section - Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-gray-200 hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-200 hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-200 hover:underline">
                Help &amp; Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-300">
        © 2024 Kochi Metro Rail Limited. All rights reserved. | Government of Kerala Enterprise
      </div>
    </footer>
    </div>
    </div>
  );

}

export default Home
