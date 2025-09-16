import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
const statusColors = {
  Active: "bg-green-200 text-green-700",
  Inactive: "bg-red-200 text-red-700",
  Pending: "bg-yellow-200 text-yellow-700",
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "" });

  // Documents
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");

  const token = localStorage.getItem("token");

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/employees/department-employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDocuments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/documents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data.data || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchEmployees();
    fetchDocuments();
  }, [token]);

  // Toggle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(employees.map((e) => e._id));
    }
    setSelectAll(!selectAll);
  };

  // Toggle select one
  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Invite employee
  const handleInvite = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/employees/invite",
        inviteData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new employee to UI
      setEmployees([
        ...employees,
        {
          _id: res.data.data.userId,
          name: inviteData.name,
          email: inviteData.email,
          createdAt: new Date(),
        },
      ]);
      toast.success(
      `Employee invited! `
    );
      console.log(`Employee invited! Temp password: ${res.data.data.password}`);

      setInviteData({ name: "", email: "" });
      setShowInvite(false);
    } catch (err) {
      console.error("Error inviting employee:", err);
      alert("Failed to invite employee");
    }
  };

  // Share document
  const handleShare = async () => {
    if (!selectedDoc) {
      alert("Please select a document to share");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/documents/${selectedDoc}/assign`,
        { userIds: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Document shared successfully!");
      setSelected([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Error sharing document:", err);
      alert("Failed to share document");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <button
          onClick={() => setShowInvite(true)}
          className="px-4 py-2 rounded bg-[#222222] text-white hover:opacity-80"
        >
          + Send Invite
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select className="border rounded p-2 text-sm">
          <option>Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
        </select>
        <select className="border rounded p-2 text-sm">
          <option>Department</option>
          <option>Engineering</option>
          <option>Design</option>
          <option>HR</option>
          <option>Marketing</option>
        </select>
        <select className="border rounded p-2 text-sm">
          <option>Date Range</option>
          <option>Last Week</option>
          <option>Last Month</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading employees...</p>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Joined</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(emp._id)}
                      onChange={() => handleSelect(emp._id)}
                    />
                  </td>
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.email}</td>
                  <td className="p-2">
                    {emp.createdAt
                      ? new Date(emp.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        statusColors[emp.status || "Active"]
                      }`}
                    >
                      {emp.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 flex items-center justify-between rounded">
          <span>{selected.length} employees selected</span>
          <div className="flex gap-2">
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="">Select Document</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.title || doc.filename}
                </option>
              ))}
            </select>
            <button
              onClick={handleShare}
              className="px-4 py-1 bg-[#222222] text-white rounded hover:opacity-80"
            >
              Share Document
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow w-80">
            <h3 className="text-lg font-semibold mb-4">Invite Employee</h3>
            <input
              type="text"
              placeholder="Name"
              value={inviteData.name}
              onChange={(e) =>
                setInviteData({ ...inviteData, name: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={inviteData.email}
              onChange={(e) =>
                setInviteData({ ...inviteData, email: e.target.value })
              }
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowInvite(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="px-3 py-1 bg-[#222] text-white rounded hover:opacity-80"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
    
  );
}
