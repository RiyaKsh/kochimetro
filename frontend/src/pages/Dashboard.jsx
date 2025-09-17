import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DashboardOverview() {
   const [overview, setOverview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8080/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        console.log("Dashboard API:", data);

        if (data.success) {
          setOverview(data.data.overview);
          setDocuments(data.data.recent.recentDocuments);
        } else {
          console.error("Backend error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [navigate]);
    if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!overview) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex justify-center items-center">
            <p className="text-red-500">Failed to load dashboard data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex justify-center">
          <div className="flex-1 bg-gray-50 p-6 max-w-5xl shadow-2xl m-6 rounded-xl">
            {/* Page Header */}
            <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

            {/* Top Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#DAE6F2] w-sm shadow-md rounded-xl py-8 ml-10 text-center ">
                <p className="text-gray-700 font-medium mb-4 text-xl">
                  Documents Uploaded Today
                </p>
                <p className="text-xl font-semibold text-[#003366] flex justify-between ">
                    <span className="ml-10">{overview.documentsUploadedToday}</span>
                   <span className="text-blue-500 text-xl mr-10">+12%</span>
                </p>
              </div>
              <div className="bg-[#DAE6F2] w-sm shadow-md rounded-xl py-8 text-center ">
                <p className="text-gray-700 font-medium mb-4 text-xl">
                  Pending Compliances
                </p>
                <p className="text-xl font-semibold text-[#003366] flex justify-between ">
                    <span className="ml-10">{overview.pendingCompliance}</span>
                   <span className="text-red-500 text-xl mr-10">-3</span>
                </p>
              </div>

              <div className="bg-[#DAE6F2] w-sm shadow-md rounded-xl  ml-10 py-8 text-center ">
                <p className="text-gray-700 font-medium mb-4 text-xl">
                 Active Departments
                </p>
                <p className="text-xl font-semibold text-[#003366] flex justify-between ">
                    <span className="ml-10">{overview.activeDepartments}</span>
                   <span className="text-blue-500 text-xl mr-10">All</span>
                </p>
              </div>

                <div className="bg-[#DAE6F2] w-sm shadow-md rounded-xl py-8 text-center ">
                <p className="text-gray-700 font-medium mb-4 text-xl">
                Knowledge Base Items
                </p>
                <p className="text-xl font-semibold text-[#003366] flex justify-between ">
                    <span className="ml-10">{overview.knowledgeBaseItems}</span>
                   <span className="text-blue-500 text-xl mr-10">+18</span>
                </p>
              </div>

              
            </div>

            {/* Recent Documents */}
            <div className="bg-white shadow-xl rounded-xl p-6">
              <div className="flex justify-between items-center mb-4 mx-8">
                <h2 className="text-lg font-semibold">Recent Documents</h2>
                <button className="text-sm font-medium text-[#003366] p-2  rounded-lg px-6 border hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-10 m-8">
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center pb-2 bg-[#ECECEC] px-4 py-4"
                    >
                      <div>
                        <p className="font-medium mb-3">{doc.title}</p>
                        <p className="text-xs text-gray-500">
                          {doc.department} •{" "}
                          {new Date(doc.createdAt).toLocaleDateString()} •{" "}
                          <span className="text-red-500">High</span>
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          doc.status === "Pending Review"
                            ? "bg-yellow-100 text-yellow-800"
                            : doc.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : doc.status === "Under Review"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent documents found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
