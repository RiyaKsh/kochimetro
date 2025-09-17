// // export default function Sidebar({ selectedTab, setSelectedTab }) {
// //   return (
// //     <aside className="w-64 bg-[#015940CC] min-h-screen p-4 text-white">
// //       <h1 className="text-xl font-bold mb-6">KMRL Admin</h1>      
// //       <button
// //         onClick={() => setSelectedTab('overview')}
// //         className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'overview' ? 'bg-black' : 'hover:bg-[#015940]'}`}
// //       >
// //         Dashboard Overview
// //       </button>

// //       <button
// //         onClick={() => setSelectedTab('departmentDocs')}
// //         className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'departmentDocs' ? 'bg-black' : 'hover:bg-[#015940]'}`}
// //       >
// //         Department Documents
// //       </button>

// //       <button
// //         onClick={() => setSelectedTab('compliance')}
// //         className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'compliance' ? 'bg-black' : 'hover:bg-[#015940]'}`}
// //       >
// //         Employees
// //       </button>

// //       <button
// //         onClick={() => setSelectedTab('sharedDocs')}
// //         className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'sharedDocs' ? 'bg-black' : 'hover:bg-[#015940]'}`}
// //       >
// //         Shared Documents
// //       </button>

// //       <button
// //         onClick={() => setSelectedTab('knowledgeBase')}
// //         className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'knowledgeBase' ? 'bg-black' : 'hover:bg-[#015940]'}`}
// //       >
// //         Knowledge Base
// //       </button>

// //       <button
// //         onClick={() => setSelectedTab('upload')}
// //         className={`w-full text-left p-2 mt-4 rounded border border-white ${selectedTab === 'upload' ? 'bg-black' : 'hover:bg-[#015940]'}`}
// //       >
// //         Upload Document
// //       </button>
// //     </aside>
// //   );
// // }

// import { FileText, LayoutDashboard, Share2, Upload, Users } from "lucide-react";
// import { NavLink } from "react-router-dom";
// export default function Sidebar({ selectedTab, setSelectedTab }) {
//   return (
//     <aside className="w-64 bg-white shadow-md flex flex-col items-center">

//         <nav className="flex-1 p-4 space-y-6 text-gray-700 mt-20">
//           {/* <NavLink 
//           to="/dash"
//           // className="flex items-center space-x-3 w-full text-left hover:text-blue-600"
//           className={({ isActive }) =>
//             `flex items-center space-x-3 w-full text-left 
//             ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
//           }
//           // onClick={() => setSelectedTab('overview')}
//           >
//             <LayoutDashboard size={24}  color="#8E8E8E"/>
//             <span className="text-blue-500">Dashboard</span>
//           </NavLink> */}
//           <NavLink
//   to="/dash"
//   className={({ isActive }) =>
//     `flex items-center space-x-3 w-full text-left px-2 py-2 rounded 
//      ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
//   }
// >
//   {({ isActive }) => (
//     <>
//       <LayoutDashboard
//         size={24}
//         className={isActive ? "text-blue-600" : "text-gray-400"}
//       />
//       <span>{isActive ? "Dashboard" : "Dashboard"}</span>
//     </>
//   )}
// </NavLink>
//           <NavLink
//           to="/documents"
//           // className="flex items-center space-x-3 w-full text-left text-blue-600 font-semibold"
//           className={({ isActive }) =>
//             `flex items-center space-x-3 w-full text-left 
//             ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
//           }
//           // onClick={() => setSelectedTab('departmentDocs')}
//           >
//             <FileText size={24}  color="#8E8E8E"/>
//             <span className="text-[#8E8E8E]">Documents</span>
//           </NavLink>
//           <NavLink
//           to="/documents/shared"
//           className="flex items-center space-x-3 w-full text-left hover:text-blue-600">
//             <Share2 size={24}  color="#8E8E8E"/>
//             <span className="text-[#8E8E8E]">Shared Documents</span>
//           </NavLink>
//           <NavLink 
//           to="/team"
//           className="flex items-center space-x-3 w-full text-left hover:text-blue-600">
//             <Users size={24}  color="#8E8E8E"/>
//             <span className="text-[#8E8E8E]">Team Members</span>
//           </NavLink>
//           <NavLink 
//           to="/documents/upload"
//           className="flex items-center space-x-3 w-full text-left hover:text-blue-600">
//             <Upload size={24}  color="#8E8E8E"/>
//             <span className="text-[#8E8E8E]">Upload Document</span>
//           </NavLink>
//         </nav>
//       </aside>
//   );
// }


import { FileText, LayoutDashboard, Share2, Upload, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col items-center">
      <nav className="flex-1 p-4 space-y-6 text-gray-700 mt-20">

        {/* Dashboard */}
        <NavLink
          to="/dash"
          className={({ isActive }) =>
            `flex items-center space-x-3 w-full text-left px-2 py-2 rounded 
            ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard
                size={24}
                className={isActive ? "text-blue-600" : "text-gray-400"}
              />
              <span>Dashboard</span>
            </>
          )}
        </NavLink>

        {/* Documents */}
        <NavLink
          to="/documents"
          end
          className={({ isActive }) =>
            `flex items-center space-x-3 w-full text-left px-2 py-2 rounded 
            ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
          }
        >
          {({ isActive }) => (
            <>
              <FileText
                size={24}
                className={isActive ? "text-blue-600" : "text-gray-400"}
              />
              <span>Documents</span>
            </>
          )}
        </NavLink>

        {/* Shared Documents */}
        <NavLink
          to="/shared"
          className={({ isActive }) =>
            `flex items-center space-x-3 w-full text-left px-2 py-2 rounded 
            ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
          }
        >
          {({ isActive }) => (
            <>
              <Share2
                size={24}
                className={isActive ? "text-blue-600" : "text-gray-400"}
              />
              <span>Shared Documents</span>
            </>
          )}
        </NavLink>

        {/* Team Members */}
        <NavLink
          to="/team"
          className={({ isActive }) =>
            `flex items-center space-x-3 w-full text-left px-2 py-2 rounded 
            ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
          }
        >
          {({ isActive }) => (
            <>
              <Users
                size={24}
                className={isActive ? "text-blue-600" : "text-gray-400"}
              />
              <span>Team Members</span>
            </>
          )}
        </NavLink>

        {/* Upload Document */}
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `flex items-center space-x-3 w-full text-left px-2 py-2 rounded 
            ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
          }
        >
          {({ isActive }) => (
            <>
              <Upload
                size={24}
                className={isActive ? "text-blue-600" : "text-gray-400"}
              />
              <span>Upload Document</span>
            </>
          )}
        </NavLink>

      </nav>
    </aside>
  );
}
