import { Users, Mail, Calendar, FileText } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Profile from "../assets/profile.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



export default function TeamMembers() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  // const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");

  // Invite modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", role: "" });

  const token = localStorage.getItem("token");

  // Fetch employees and documents
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/employees/department-employees",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDocuments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/documents",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDocuments(res.data.data || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchEmployees();
    fetchDocuments();
  }, [token]);

  // Invite employee
  const handleInvite = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/employees/invite",
        inviteData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees([
        ...employees,
        {
          _id: res.data.data.userId,
          name: inviteData.name,
          email: inviteData.email,
          role: inviteData.role,
          createdAt: new Date(),
          department: "Engineering", // adjust if needed
        },
      ]);

      toast.success(`Employee invited! Temp password: ${res.data.data.password}`);
      setInviteData({ name: "", email: "", role: "" });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error inviting employee:", err);
      toast.error("Failed to invite employee");
    }
  };

  // Select/Deselect employees
  // const handleSelectAll = () => {
  //   if (selectAll) setSelected([]);
  //   else setSelected(employees.map((e) => e._id));
  //   setSelectAll(!selectAll);
  // };

  const handleSelect = (id) => {
    if (selected.includes(id)) setSelected(selected.filter((sid) => sid !== id));
    else setSelected([...selected, id]);
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
      // setSelectAll(false);
    } catch (err) {
      console.error("Error sharing document:", err);
      alert("Failed to share document");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex justify-center">
          <div className="flex-1 bg-gray-50 p-6 max-w-5xl shadow-2xl m-6 ">
            {/* Page Header */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold">Team Members</h1>
                  <p className="text-gray-500 text-sm">
                    Manage team access and permissions
                  </p>
                </div>
                <div className="flex gap-3 mt-3 sm:mt-0">
                  <button
                    className="bg-[#003366] text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-blue-800"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Invite Members
                  </button>
                  <button className="bg-[#003366] text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-300">
                    Transfer Ownership
                  </button>
                </div>
              </div>

              {/* Bulk action bar */}
              {selected.length > 0 && (
                <div className="mb-4 p-3 bg-gray-100 flex flex-wrap items-center gap-2 rounded">
                  <span>{selected.length} members selected</span>
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
              )}

              {/* Team Members Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
                {loading ? (
                  <p>Loading employees...</p>
                ) : (
                  employees.map((member, idx) => (
                    <div
                      key={member._id || idx}
                      className={`bg-white rounded-xl shadow-xl p-8 hover:shadow-lg transition ${
                        selected.includes(member._id) ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      {/* Top section */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img src={Profile} alt="" />
                          <div>
                            <h2 className="font-semibold text-gray-800">{member.name}</h2>
                            <p className="text-xs text-gray-500">{member.department || "—"}</p>
                          </div>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                          {member.role || "Employee"}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          {member.email}
                        </p>
                        <p className="flex items-center gap-15">
                          <span className="text-xs text-gray-500">Joined:</span>{" "}
                          <span>{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "—"}</span>
                        </p>
                        <p className="flex items-center gap-10">
                          <span className="text-xs text-gray-500">Last Active:</span>{" "}
                          {member.lastActive || "—"}
                        </p>
                        <p className="flex items-center gap-7">
                          Documents: <span>{member.documents || 0}</span>
                        </p>
                      </div>

                      {/* Select checkbox */}
                      <div className="flex gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(member._id)}
                          onChange={() => handleSelect(member._id)}
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 border border-[#003366] text-[#003366] px-3 py-1.5 rounded-md text-base font-semibold hover:bg-blue-800">
                          Edit
                        </button>
                        <button className="flex-1 border border-gray-00 text-gray-500 px-3 py-1.5 rounded-md text-base font-medium hover:bg-gray-300">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="bg-white shadow-xl rounded-xl p-4 text-center">
                  <p className="text-xl font-semibold text-[#003366]">{employees.length}</p>
                  <p className="text-xl font-semibold text-[#003366]">Total Members</p>
                </div>
                <div className="bg-white shadow-xl rounded-xl p-4 text-center">
                  <p className="text-xl font-semibold text-[#003366]">
                    {employees.filter((e) => e.role === "Admin").length}
                  </p>
                  <p className="text-xl font-semibold text-[#003366]">Admins</p>
                </div>
                <div className="bg-white shadow-xl rounded-xl p-4 text-center">
                  <p className="text-xl font-semibold text-[#003366]">
                    {employees.filter((e) => e.role === "Lead").length}
                  </p>
                  <p className="text-xl font-semibold text-[#003366]">Leads</p>
                </div>
                <div className="bg-white shadow-xl rounded-xl p-4 text-center">
                  <p className="text-xl font-semibold text-[#003366]">
                    {employees.filter((e) => !["Admin","Lead"].includes(e.role)).length}
                  </p>
                  <p className="text-xl font-semibold text-[#003366]">Employees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Invite New Team Member</h2>
              <button onClick={() => setIsModalOpen(false)}>✖</button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={inviteData.name}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className="mt-1 block w-full border bg-gray-200 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, email: e.target.value })
                  }
                  placeholder="Enter the email"
                  className="mt-1 block w-full border bg-gray-200 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={inviteData.role}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, role: e.target.value })
                  }
                  className="mt-1 bg-gray-200 block w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Lead">Lead</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="px-4 py-2 rounded-md bg-[#003366] text-white hover:bg-blue-800"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
