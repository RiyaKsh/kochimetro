"use client";

import React from "react";
import {
  Eye,
} from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { NavLink } from "react-router-dom";

export default function PreviousDocument() {

  return (
    <>
      <Header />
      <div className="flex  bg-gray-100">
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
                <div className="flex mb-4 space-x-2">
                  <NavLink
                    to="/documents"
                    className={({ isActive }) =>
                      `px-4 py-2 font-medium rounded-xl border-b-2 ${
                        isActive ? "text-white bg-[#003366]" : "text-gray-500"
                      }`
                    }
                  >
                    Current Documents
                  </NavLink>

                  <NavLink
                    to="/previous"
                    className={({ isActive }) =>
                      `px-4 py-2 font-medium rounded-xl border-b-2 ${
                        isActive ? "text-white bg-[#003366]" : "text-gray-500"
                      }`
                    }
                  >
                    Previous Documents
                  </NavLink>
                </div>

                {/* Document list - Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-10">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-5 border border-gray-200 shadow-xl relative"
                      >
                        {/* Title + Eye icon */}
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-lg text-[#003366]">
                            Vendor Contract Agreement
                          </h3>
                          <Eye size={26} className="text-gray-500" />
                        </div>

                        {/* Description */}
                        <p className="text-base font-semibold text-[#888888] mb-4">
                          Legal agreement with maintenance service
                          <br />
                          providers for metro stations.
                        </p>

                        {/* Two-column structure like your reference */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                          {/* Row 1: Tags */}
                          <div className="col-span-2 flex gap-12">
                            <span className="bg-[#FEE6BD] text-yellow-800 w-fit px-3 py-1 rounded text-xs font-medium text-center flex justify-self-start">
                              Contract
                            </span>
                            <span className="bg-[#FEE6BD] text-yellow-800 w-fit px-3 py-1 rounded text-xs font-medium text-start flex justify-self-start">
                              Vendor
                            </span>
                          </div>
                          {/* Row 2: Department */}
                          <div className="col-span-2 flex gap-10">
                            <span className="font-medium text-gray-600">
                              Department :
                            </span>
                            <span className="text-gray-600">Procurement</span>
                          </div>
                          {/* Row 3: Owner */}
                          <div className="col-span-2 flex gap-20">
                            <span className="font-medium text-gray-600">
                              Owner :
                            </span>
                            <span className="text-gray-600">John Doe</span>
                          </div>
                          {/* Row 4: Date */}
                          <div className="col-span-2 flex gap-22">
                            <span className="font-medium text-gray-600">
                              Date :
                            </span>
                            <span className="text-gray-600">2025-09-14</span>
                          </div>
                          {/* Row 5: Medium + Approved */}
                          <div className="col-span-2 flex gap-20">
                            <span className="text-[#CFBA00] font-medium text-lg">
                              Medium
                            </span>
                            <span className="bg-[#ACE29C] text-green-800 px-3 py-1 rounded text-sm font-medium text-center">
                              Approved
                            </span>
                          </div>
                        </div>
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
