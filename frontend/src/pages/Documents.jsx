"use client";

import React, { useState } from "react";
import {
  Bell,
  LogOut,
  Search,
  Eye,
  FileText,
  Share2,
  Users,
  Upload,
  LayoutDashboard,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Documents() {
  const [activeTab, setActiveTab] = useState("current");

  const documents = [
    {
      title: "Safety Protocol Update Q4 2025",
      date: "2025-09-13",
      status: "Pending Review",
      color: "bg-[#DDD275] text-[#585901]",
    },
    {
      title: "Budget Allocation Report",
      date: "2025-09-13",
      status: "Approved",
      color: "bg-[#ACE29C] text-green-800",
    },
    {
      title: "Engineering Standards Manual",
      date: "2025-09-13",
      status: "Under Review",
      color: "bg-[#9CC2E2] text-blue-800",
    },
    {
      title: "Manual Update",
      date: "2025-09-13",
      status: "Draft",
      color: "bg-[#BFBFBF] text-gray-800",
    },
  ];

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}

        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Content */}
          <main className="flex-1 p-10">
            <div className="bg-white shadow-2xl rounded-xl p-6">
              {/* Filters */}
              <div className="flex space-x-4 mb-6 pl-20">
                <h2 className="text-xl font-medium">Documents</h2>
                <input
                  type="text"
                  placeholder="Search documents"
                  className="bg-[#ECECEC] px-3 py-2 border rounded-md text-sm w-1/3"
                />
                <select className="bg-[#ECECEC] px-3 py-2 border rounded-md text-sm">
                  <option>All Departments</option>
                </select>
                <select className="bg-[#ECECEC] px-3 py-2 border rounded-md text-sm">
                  <option>All Languages</option>
                </select>
              </div>

              <div className="bg-white shadow-xl rounded-xl p-10 m-10">
                {/* Tabs */}
                <div className="flex mb-4">
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "current"
                        ? "text-white rounded-xl border-b-2 bg-[#003366]"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("current")}
                  >
                    Current Documents
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "previous"
                        ? "text-white rounded-xl border-b-2 bg-[#003366]"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("previous")}
                  >
                    Previous Documents
                  </button>
                </div>

                {/* Document list */}
                <div className="space-y-4">
                  {documents.map((doc, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 items-center bg-[#ECECEC] px-4 py-4 rounded-lg gap-4"
                    >
                      {/* Column 1: Title */}
                      <div className="col-span-2">
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-xs text-gray-500">{doc.date}</p>
                      </div>

                      {/* Column 3: Eye Icon */}
                      <Eye size={24} className="text-gray-500" />

                      {/* Column 4: Status */}
                      <span
                        className={`w-[120px] px-2 py-1 rounded text-sm font-medium  flex items-center justify-center ${doc.color}`}
                      >
                        {doc.status}
                      </span>

                      {/* Column 5: Approve */}
                      <button className="text-[#003366] text-base font-medium hover:underline">
                        Approve
                      </button>

                      {/* Column 6: Reject */}
                      <button className="text-red-600 text-base font-medium hover:underline">
                        Reject
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
