import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DashboardOverview() {
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
                    <span className="ml-10">24</span>
                   <span className="text-blue-500 text-xl mr-10">+12%</span>
                </p>
              </div>
              <div className="bg-[#DAE6F2] w-sm shadow-md rounded-xl py-8 text-center ">
                <p className="text-gray-700 font-medium mb-4 text-xl">
                  Pending Compliance
                </p>
                <p className="text-xl font-semibold text-[#003366] flex justify-between ">
                    <span className="ml-10">8</span>
                   <span className="text-red-500 text-xl mr-10">-3</span>
                </p>
              </div>

              <div className="bg-[#DAE6F2] w-sm shadow-md rounded-xl  ml-10 py-8 text-center ">
                <p className="text-gray-700 font-medium mb-4 text-xl">
                 Active Departments
                </p>
                <p className="text-xl font-semibold text-[#003366] flex justify-between ">
                    <span className="ml-10">9</span>
                   <span className="text-blue-500 text-xl mr-10">All</span>
                </p>
              </div>

                <div className="bg-[#DAE6F2] w-sm shadow-md rounded-xl py-8 text-center ">
                <p className="text-gray-700 font-medium mb-4 text-xl">
                Knowledge Base Items
                </p>
                <p className="text-xl font-semibold text-[#003366] flex justify-between ">
                    <span className="ml-10">150</span>
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

              <div className="space-y-10 m-8 ">
                {/* Document Row */}
                <div className="flex justify-between items-center  pb-2 bg-[#ECECEC] px-4 py-4">
                  <div>
                    <p className="font-medium mb-3">Safety Protocol Update Q4 2024</p>
                    <p className="text-xs text-gray-500">
                      Safety • 2025-09-13 •{" "}
                      <span className="text-red-500">High</span>
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded">
                    Pending Review
                  </span>
                </div>

                <div className="flex justify-between items-center  pb-2 bg-[#ECECEC] px-4 py-4">
                  <div>
                    <p className="font-medium mb-3">Budget Allocation Report</p>
                    <p className="text-xs text-gray-500">
                      Finance • 2025-09-13 •{" "}
                      <span className="text-yellow-600">Medium</span>
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded">
                    Approved
                  </span>
                </div>

                <div className="flex justify-between items-center  pb-2 bg-[#ECECEC] px-4 py-4">
                  <div>
                    <p className="font-medium mb-3">Engineering Standards Manual</p>
                    <p className="text-xs text-gray-500">
                      Engineering • 2025-09-13 •{" "}
                      <span className="text-red-500">High</span>
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded">
                    Under Review
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[#ECECEC] px-4 py-4">
                  <div>
                    <p className="font-medium mb-3">HR Policy Update</p>
                    <p className="text-xs text-gray-500">
                      HR • 2025-09-13 •{" "}
                      <span className="text-gray-500">Low</span>
                    </p>
                  </div>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs font-medium rounded">
                    Draft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
