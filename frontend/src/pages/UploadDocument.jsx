import { useState } from "react";
import { FileText, Shield } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Lock from  "../assets/lock.png";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    department: "",
    language: "",
    priority: "",
    access: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...form, file });
  };

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
            <h1 className="text-2xl font-semibold mb-6">Upload document</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="bg-white rounded-xl shadow p-8">
              {/* Uploaded File */}
              <div className="bg-gray-200 rounded-xl shadow p-5 mb-6">
                <h2 className="flex items-center gap-2 text-lg font-medium mb-4 ">
                  <FileText className="text-gray-800" size={18} /> Uploaded File
                </h2>
                <div className="border border-gray-300 rounded-lg p-4 bg-[#AAAAAA]">
                  {file ? (
                    <p className="text-sm font-medium text-gray-700">
                      {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  ) : (
                    <label className="cursor-pointer text-blue-600 hover:underline">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      Click to upload a file
                    </label>
                  )}
                </div>
              </div>

              {/* Document Details */}
              <div className="bg-gray-200 rounded-xl shadow p-5">
                <h2 className="flex items-center gap-2 text-lg font-medium mb-4">
                  <FileText className="text-gray-900" size={18} /> Document
                  Details
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Document Title*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="mt-1 w-full bg-[#D9D9D9]  border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category*
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="mt-1 w-full bg-[#D9D9D9] border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select the category</option>
                      <option value="Policy">Policy</option>
                      <option value="Finance">Finance</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief description of the document"
                    className="mt-1 bg-[#D9D9D9] w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department*
                    </label>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="mt-1 bg-[#D9D9D9] w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select the department</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      className="mt-1 bg-[#D9D9D9] w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select the language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="mt-1 bg-[#D9D9D9] w-full border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select the priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
              </div>

              {/* Access Control */}
              <div className="bg-white rounded-xl shadow p-5">
                <div className="bg-gray-200 p-3 rounded-xl">
                <h2 className="flex items-center gap-2 text-lg font-medium mb-4">
                  {/* <Shield className="text-blue-600" size={18} /> */}
                  <img src={Lock} alt="lock" className="w-8 h-8" /> 
                  Access Control
                </h2>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="access"
                      value="Private"
                      checked={form.access === "Private"}
                      onChange={handleChange}
                    />
                    Private (only me)
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="access"
                      value="Department"
                      checked={form.access === "Department"}
                      onChange={handleChange}
                    />
                    Department (administration)
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="access"
                      value="Shared"
                      checked={form.access === "Shared"}
                      onChange={handleChange}
                    />
                    Shared across departments
                  </label>
                </div>

                <div className="mt-3 bg-blue-50 text-blue-800 px-3 py-2 rounded text-sm">
                  <span className="font-medium">Note:</span> Choose access
                  carefully, as it determines who can view this document.
                </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003366] text-white rounded-md hover:bg-blue-800"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
