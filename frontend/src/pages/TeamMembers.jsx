import { Users, Mail, Calendar, FileText } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Profile from "../assets/profile.png";
import { useState } from "react";

export default function TeamMembers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const members = Array(9).fill({
    name: "John Doe",
    email: "john.doe1234@gmail.com",
    joined: "2025-03-14",
    lastActive: "2025-09-14",
    documents: 140,
    role: "Admin",
    department: "Engineering",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex justify-center">
        <div className="flex-1 bg-gray-50 p-6  max-w-5xl shadow-2xl m-6 ">
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
              <button className="bg-[#003366] text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-blue-800"
              onClick={() => setIsModalOpen(true)}
              >
                Invite Members
              </button>
              <button className="bg-[#003366] text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-300">
                Transfer Ownership
              </button>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
            {members.map((member, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-xl p-8  hover:shadow-lg transition ${
                  idx === 1 ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {/* Top section */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* <Users className="text-blue-700" size={22} /> */}
                    <img src={Profile} alt="" />
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {member.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {member.department}
                      </p>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                    {member.role}
                  </span>
                </div>

                {/* Details */}
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    {member.email}
                  </p>
                  <p className="flex items-center gap-15">
                    {/* <Calendar size={14} className="text-gray-400" /> */}
                    <span className="text-xs text-gray-500">Joined:</span>{" "}
                    <span>{member.joined}</span>
                  </p>
                  <p className="flex items-center gap-10">
                    {/* <Calendar size={14} className="text-gray-400" /> */}
                    <span className="text-xs text-gray-500">Last Active:</span>{" "}
                    {member.lastActive}
                  </p>
                  <p className="flex items-center gap-7">
                    {/* <FileText size={14} className="text-gray-400" /> */}
                    Documents: 
                    <span>{member.documents}</span>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 border border-[#003366]  text-[#003366] px-3 py-1.5 rounded-md text-base font-semibold hover:bg-blue-800">
                    Edit
                  </button>
                  <button className="flex-1 border border-gray-00 text-gray-500 px-3 py-1.5 rounded-md text-base font-medium hover:bg-gray-300">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6  ">
            <div className="bg-white shadow-xl rounded-xl p-4 text-center">
              <p className="text-xl font-semibold text-[#003366]">6</p>
              <p className="text-xl font-semibold text-[#003366]">Total Members</p>
            </div>
            <div className="bg-white shadow-xl rounded-xl p-4 text-center">
              <p className=" text-xl font-semibold text-[#003366]">1</p>
              <p className=" text-xl  font-semibold text-[#003366]">Admins</p>
            </div>
            <div className="bg-white shadow-xl rounded-xl p-4 text-center">
              <p className="text-xl font-semibold text-[#003366]">3</p>
              <p className="text-xl  font-semibold text-[#003366]">Leads</p>
            </div>
            <div className="bg-white shadow-xl rounded-xl p-4 text-center">
              <p className="text-xl font-semibold text-[#003366]">8</p>
              <p className="text-xl  font-semibold text-[#003366]">Employees</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-30  bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Invite New Team Member</h2>
              <button onClick={() => setIsModalOpen(false)}>✖</button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email"
                  className="mt-1 block w-full border bg-gray-200 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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
                onClick={() => {
                  console.log("Invite Sent:", email, role);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 rounded-md bg-[#003366] text-white hover:bg-blue-800"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
