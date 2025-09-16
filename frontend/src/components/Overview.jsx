import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 make sure react-router-dom is installed
import OverviewCard from "./OverviewCard";
import DocumentList from "./DocumentList";

const Overview = () => {
  const [overview, setOverview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 JWT from login/signup
        if (!token) {
          console.error("No token found, redirecting to login...");
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8080/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // 👈 attach token
          }
        });

        if (res.status === 401) {
          console.error("Unauthorized — redirecting to login...");
          navigate("/login");
          return;
        }

        const data = await res.json();
        console.log("API response:", data);

        if (data.success) {
          setOverview(data.data.overview);
          setDocuments(data.data.recent.recentDocuments);
        } else {
          console.error("Backend returned error:", data.message);
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
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
        <p>Loading dashboard data...</p>
      </main>
    );
  }

  if (!overview) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
        <p className="text-red-500">Failed to load dashboard data.</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="Documents Uploaded Today"
          value={overview.documentsUploadedToday}
          change="+12%"
          changeColor="text-green-600"
        />
        <OverviewCard
          title="Pending Compliance"
          value={overview.pendingCompliance}
          change="-3"
          changeColor="text-red-600"
        />
        <OverviewCard
          title="Active Departments"
          value={overview.activeDepartments}
          change="All"
          changeColor="text-blue-600"
        />
        <OverviewCard
          title="Knowledge Base Items"
          value={overview.knowledgeBaseItems}
          change="+18"
          changeColor="text-purple-600"
        />
      </div>

      {/* Recent Documents */}
      <DocumentList
        documents={documents.map((doc) => ({
          title: doc.title,
          department: doc.department,
          date: new Date(doc.createdAt).toLocaleDateString(),
          priority: "Medium", // fallback since backend doesn't send it
          status: doc.status,
          statusColor:
            doc.status === "Pending Review"
              ? "bg-yellow-500"
              : doc.status === "Approved"
              ? "bg-green-500"
              : "bg-gray-500"
        }))}
      />
    </main>
  );
};

export default Overview;
