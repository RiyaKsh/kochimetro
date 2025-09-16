import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils/utils";
import { Link } from "react-router-dom";
import Header from "../components/Header";
function AuthCard() {
  const [activeTab, setActiveTab] = useState("signin"); // "signin" | "signup"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  const { email, password } = formData;
  if (!email || !password) {
    return handleError("Email and password are required");
  }
  try {
    const url = "http://localhost:8080/api/auth/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    console.log("Login response:", result); // 👈 Debug log

    const { success, message, data, error } = result;

    if (success) {
      handleSuccess(message);

      // Save token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedInUser", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("department", data.user.department);

      // Redirect (use backend-provided redirect or fallback)
      const redirectPath = data.redirectTo || "/dashboard";
      setTimeout(() => navigate(redirectPath), 1000);
    } else if (error) {
      handleError(error?.details?.[0]?.message || "Login failed");
    } else {
      handleError(message);
    }
  } catch (err) {
    handleError(err.message);
  }
};


  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password,department } = formData;
    if (!name || !email || !password ||!department) {
      return handleError("All fields are required");
    }
    try {
      const url = "http://localhost:8080/api/auth/register";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password ,department,role:"admin"})
      });
      const result = await response.json();
      const { success, message, jwtToken, name: userName, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", userName);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else if (error) {
        handleError(error?.details[0].message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div>
      <Header/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-4">
      <Link
        to="/"
        
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#015940] transition-colors duration-150 text-base font-medium "
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Home
      </Link>
    </div>
      {/* Card */}
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-2xl border border-[#015940]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-[#015940] rounded-full">
            <span className="text-white text-xl">🔒</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold">Administrator Access</h2>
          <p className="text-gray-500 text-sm">KMRL Document Intelligence Portal</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActiveTab("signin")}
            className={`w-1/2 py-2 text-sm font-semibold rounded-full ${
              activeTab === "signin" ? "bg-white shadow" : ""
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`w-1/2 py-2 text-sm font-semibold rounded-full ${
              activeTab === "signup" ? "bg-white shadow" : ""
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {activeTab === "signin" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full mt-1 p-2 border rounded-md focus:outline-[#015940]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 p-2 border rounded-md focus:outline-[#015940]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#015940] text-white rounded-md font-semibold"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-1 p-2 border rounded-md focus:outline-[#015940]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full mt-1 p-2 border rounded-md focus:outline-[#015940]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 p-2 border rounded-md focus:outline-[#015940]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Department</label>
              <input
                type="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter your department"
                className="w-full mt-1 p-2 border rounded-md focus:outline-[#015940]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#015940] text-white rounded-md font-semibold"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>

      <ToastContainer />
    </div>
    </div>
  );
}

export default AuthCard;
