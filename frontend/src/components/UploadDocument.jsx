import React, { useState } from "react";

export default function UploadDocument() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    department: "",
    language: "",
    priority: "",
    accessControl: [],
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccessChange = (value) => {
    setFormData((prev) => {
      const exists = prev.accessControl.includes(value);
      return {
        ...prev,
        accessControl: exists
          ? prev.accessControl.filter((v) => v !== value)
          : [...prev.accessControl, value],
      };
    });
  };

  const handleUpload = () => {
    if (!file) return alert("Please select a file");

    const data = new FormData();
    data.append("file", file);

    Object.keys(formData).forEach((key) => {
      data.append(
        key,
        Array.isArray(formData[key])
          ? JSON.stringify(formData[key])
          : formData[key]
      );
    });

    console.log("Uploading with data:", Object.fromEntries(data));

    // Replace with API call
    // fetch("/api/documents/upload", { method: "POST", body: data });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Document</h2>

      {/* Upload Section */}
      {!file ? (
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
          <label className="flex items-center mb-4 text-[#015940] font-medium">
            <span className="material-icons mr-2">cloud_upload</span>
            Upload File
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-200">
            <input
              type="file"
              className="hidden"
              id="fileUpload"
              onChange={handleFileChange}
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="text-gray-600">
                Drop files here or{" "}
                <span className="text-[#015940] font-medium">click to browse</span>
              </div>
            </label>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Supports: PDF, Word, Text, Images (Max 50MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File preview */}
          <div className="p-4 bg-gray-100 rounded">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-600">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>

          {/* Document Details */}
          <input
            type="text"
            name="title"
            placeholder="Document Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="safety">Safety</option>
            <option value="finance">Finance</option>
            <option value="engineering">Engineering</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Department</option>
              <option value="hr">HR</option>
              <option value="engineering">Engineering</option>
              <option value="finance">Finance</option>
            </select>

            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Language</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Access Control */}
          <div className="p-4 border rounded">
            <label className="block">
              <input
                type="checkbox"
                onChange={() => handleAccessChange("private")}
                checked={formData.accessControl.includes("private")}
              />
              Private (only me)
            </label>
            <label className="block">
              <input
                type="checkbox"
                onChange={() => handleAccessChange("department")}
                checked={formData.accessControl.includes("department")}
              />
              Department (administration)
            </label>
            <label className="block">
              <input
                type="checkbox"
                onChange={() => handleAccessChange("shared")}
                checked={formData.accessControl.includes("shared")}
              />
              Shared across departments
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 border rounded"
              onClick={() => setFile(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#015940] text-white rounded hover:bg-green-800"
              onClick={handleUpload}
            >
              Upload Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
