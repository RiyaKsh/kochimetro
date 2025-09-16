import React, { useEffect, useState } from "react";

const statusColors = {
  "Pending Review": "bg-yellow-300 text-yellow-800",
  Approved: "bg-green-300 text-green-800",
  "Under Review": "bg-blue-300 text-blue-800",
  Draft: "bg-gray-300 text-gray-800",
};

export default function DepartmentDocs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [viewAll, setViewAll] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null); // modal state

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/documents", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setDocs(data.data.documents);
        }
      } catch (err) {
        console.error("Error fetching docs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const categorizeDocs = (docs) => {
    const today = [];
    const lastWeek = [];
    const lastMonth = [];

    const now = new Date();
    const todayDate = now.toDateString();

    docs.forEach((doc) => {
      const docDate = new Date(doc.createdAt);
      const diffInMs = now - docDate;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (docDate.toDateString() === todayDate) {
        today.push(doc);
      } else if (diffInDays <= 7) {
        lastWeek.push(doc);
      } else if (diffInDays <= 30) {
        lastMonth.push(doc);
      }
    });

    return { today, lastWeek, lastMonth };
  };

  const groupedDocs = categorizeDocs(docs);

  const renderDocCard = (doc, index) => (
    <div
      key={doc._id || index}
      className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-sm cursor-pointer hover:bg-gray-200"
      onClick={() => setSelectedDoc(doc)} // open modal
    >
      <div>
        <h3 className="font-semibold">{doc.title}</h3>
        <p className="text-sm text-gray-600">
          {new Date(doc.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500">{doc.description}</p>
      </div>

      <div className="flex items-center space-x-4">
        <span
          className={`px-2 py-1 rounded text-sm ${
            statusColors[doc.status] || "bg-gray-200 text-gray-700"
          }`}
        >
          {doc.status}
        </span>
      </div>
    </div>
  );

  if (loading) return <p className="p-6">Loading documents...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("current")}
          className={`px-4 py-2 font-medium ${
            activeTab === "current"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Current Docs
        </button>
        <button
          onClick={() => setActiveTab("prev")}
          className={`px-4 py-2 font-medium ${
            activeTab === "prev"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Prev Docs
        </button>
      </div>

      {/* Current Docs */}
      {activeTab === "current" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Department Documents</h2>
            <button
              onClick={() => setViewAll((prev) => !prev)}
              className="text-blue-600 hover:underline text-sm"
            >
              {viewAll ? "Back to Categories" : "View All"}
            </button>
          </div>

          {!viewAll ? (
            <>
              {groupedDocs.today.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Today</h3>
                  <div className="space-y-4">
                    {groupedDocs.today.map(renderDocCard)}
                  </div>
                </div>
              )}

              {groupedDocs.lastWeek.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Last Week</h3>
                  <div className="space-y-4">
                    {groupedDocs.lastWeek.map(renderDocCard)}
                  </div>
                </div>
              )}

              {groupedDocs.lastMonth.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Last Month</h3>
                  <div className="space-y-4">
                    {groupedDocs.lastMonth.map(renderDocCard)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {docs
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(renderDocCard)}
            </div>
          )}
        </>
      )}

      {/* Prev Docs Placeholder */}
      {activeTab === "prev" && (
        <div className="p-4 text-gray-600">
          <p className="text-center italic">Prev docs will be shown here later.</p>
        </div>
      )}

      {/* Modal */}
 {selectedDoc && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">{selectedDoc.title}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Uploaded on {new Date(selectedDoc.createdAt).toLocaleString()}
      </p>
      <p className="mb-4">{selectedDoc.description}</p>

      <div className="mb-4">
        <strong>Status:</strong>{" "}
        <span
          className={`px-2 py-1 rounded text-sm ${
            statusColors[selectedDoc.status] || "bg-gray-200 text-gray-700"
          }`}
        >
          {selectedDoc.status}
        </span>
      </div>

      <div className="mb-4">
        <strong>Uploaded By:</strong> {selectedDoc.uploadedBy?.name} (
        {selectedDoc.uploadedBy?.email})
      </div>

      {/* Document file */}
      {selectedDoc.versions && selectedDoc.versions.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <img
            src="/pdf-icon.png" // a small pdf icon in your public folder
            alt="PDF"
            className="w-6 h-6"
          />
          <a
            href={`http://localhost:8080/${selectedDoc.versions[selectedDoc.currentVersion - 1].fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View / Download Document
          </a>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setSelectedDoc(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
