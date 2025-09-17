import { FileText, Settings, ClipboardList, User, DollarSign, ShieldCheck, Scale } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SharedDocument() {
  const [documentsByDept, setDocumentsByDept] = useState({});
  const token = localStorage.getItem("token");

  // Hardcoded department statistics data
  const statsDepartments = [
    { name: "Engineering", icon: Settings, count: 45 },
    { name: "Procurement", icon: ClipboardList, count: 45 },
    { name: "HR", icon: User, count: 45 },
    { name: "Finance", icon: DollarSign, count: 45 },
    { name: "Safety", icon: ShieldCheck, count: 45 },
    { name: "Legal", icon: Scale, count: 45 },
  ];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/documents/shared", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const docs = res.data.data || [];

        // Group documents by department
        const grouped = {};
        docs.forEach((doc) => {
          const dept = doc.department || "Unknown";
          if (!grouped[dept]) grouped[dept] = [];
          grouped[dept].push(doc);
        });

        setDocumentsByDept(grouped);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchDocuments();
  }, [token]);

  return (
    <div className="space-y-8">
      <Header />

      <div className="flex gap-6">
        <Sidebar />

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-4xl space-y-8">
            {/* Shared Documents */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-[#003366]">
                Shared Documents
              </h2>
              <h3 className="mb-6">Browse Document by department</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(documentsByDept).map((dept, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-[#003366]">{dept}</h3>
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                        {documentsByDept[dept].length} Docs
                      </span>
                    </div>

                    <h2 className="mb-4">Recent Documents:</h2>

                    {/* Document List */}
                    <ul className="text-sm text-gray-600 space-y-1 mb-3">
                      {documentsByDept[dept].map((doc, i) => (
                        <li key={i} className="truncate flex flex-row mb-2 gap-2">
                          <FileText size={16} color="#8E8E8E" />
                          {doc.title || doc.filename}
                        </li>
                      ))}
                    </ul>

                    {/* Footer */}
                    <p className="text-xs text-gray-400 mt-8">
                      Last updated: Today Click to explore
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Statistics */}
            <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
              <h2 className="text-xl font-semibold text-[#003366] mb-6">
                Department Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                {statsDepartments.map((dept, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <dept.icon className="bg-[#003366] p-2 text-white" size={42} />
                    <p className="text-sm text-gray-600">{dept.name}</p>
                    <span className="text-xs text-gray-500">{dept.count} docs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
