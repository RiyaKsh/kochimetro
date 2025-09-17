"use client";

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { NavLink, useNavigate } from "react-router-dom";

const statusColors = {
  "Pending Review": "bg-[#DDD275] text-[#585901]",
  Approved: "bg-[#ACE29C] text-green-800",
  "Under Review": "bg-[#9CC2E2] text-blue-800",
  Draft: "bg-[#BFBFBF] text-gray-800",
};

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8080/api/documents", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setDocuments(data.data.documents);
        } else {
          console.error("Backend error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching docs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [navigate]);

  if (loading) {
    return <p className="p-6">Loading documents...</p>;
  }

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
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

                {/* Document list */}
                <div className="space-y-4">
                  {documents.map((doc, i) => (
                    <div
                      key={doc._id || i}
                      onClick={() => navigate("/details")}
                      className="grid grid-cols-6 items-center bg-[#ECECEC] px-4 py-4 rounded-lg gap-4"
                    >
                      {/* Column 1: Title */}
                      <div className="col-span-2">
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Column 3: Eye Icon */}
                      <Eye size={24} className="text-gray-500" />

                      {/* Column 4: Status */}
                      <span
                        className={`w-[120px] px-2 py-1 rounded text-sm font-medium flex items-center justify-center ${
                          statusColors[doc.status] ||
                          "bg-gray-200 text-gray-700"
                        }`}
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
