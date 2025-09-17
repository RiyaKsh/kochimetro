// import { useState } from "react";
// import { Edit, Share2, Archive } from "lucide-react";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import Chat from "../assets/chat.png"

// export default function DocumentDetails() {
//   const [notes, setNotes] = useState(
//     "Initial review completed. Document appears comprehensive and well-structured."
//   );

//   return (
//     <div className="min-h-screen flex flex-col">
//            <Header/>
//  <div className="flex flex-1">
//            <Sidebar/>
//     <div className="flex-1 bg-gray-50 flex justify-center">
//         <img src={Chat} alt="chat"   className="w-10 h-10 absolute top-20 right-6 bottom-6 cursor-pointer"/>
//       <div className="max-w-4xl mx-auto space-y-6  shadow-2xl p-6 m-6 rounded-4xl">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           {/* <div className="space-y-1">
//             <h1 className="text-xl font-semibold">
//               Safety Protocol Update Q4 2025
//             </h1>
//             <div className="flex gap-2">
//               <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
//                 Safety
//               </span>
//               <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
//                 English
//               </span>
//             </div>
//           </div> */}

//           {/* <div className="flex items-center gap-4 text-sm font-medium text-gray-600"> */}
//              <h1 className="text-2xl font-semibold">
//               Safety Protocol Update Q4 2025
//             </h1>
//             <div className="flex gap-2">
//               <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
//                 Safety
//               </span>
//               <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
//                 English
//               </span>
//             </div>
//             <button className="flex items-center gap-1 hover:text-blue-700">
//               <Edit size={16} /> Edit
//             </button>
//             <button className="flex items-center gap-1 hover:text-blue-700">
//               <Share2 size={16} /> Share
//             </button>
//             <button className="flex items-center gap-1 hover:text-red-600">
//               <Archive size={16} /> Archive
//             </button>
//           {/* </div> */}
//         </div>

//         {/* AI Summary */}
//         <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4">
//           <h2 className="font-semibold">AI-Generated Summary</h2>
//           <p className="text-sm text-gray-700 leading-relaxed">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
//             ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
//             aliquip ex ea commodo consequat. Duis aute irure dolor in
//             reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
//             pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
//             culpa qui officia deserunt mollit anim id est laborum.
//           </p>
//           <div className="bg-orange-100 border-l-4 border-orange-400 px-3 py-2 rounded text-sm text-gray-700">
//             <p className="font-medium">Key insights</p>
//             <p className="text-xs">
//               This document contains critical information for engineering
//               operations. Priority level is high, requiring appropriate attention
//               and follow-up actions.
//             </p>
//           </div>
//         </div>

//         {/* Notes */}
//         <div className="bg-white rounded-2xl shadow-xl p-5 space-y-3">
//           <h2 className="font-semibold">Notes</h2>
//           <textarea
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             className="w-full border rounded-md p-2 bg-gray-100 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             rows={4}
//           />
//           <button className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
//             Save notes
//           </button>
//         </div>

//         {/* Document Details */}
//         <div className="bg-white rounded-2xl shadow-xl p-5">
//           <h2 className="font-semibold mb-4">Document Details</h2>
//           <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
//             <div>
//               <p className="text-xs text-gray-500">Uploaded by</p>
//               <p className="font-medium">John Doe</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Language</p>
//               <p className="font-medium">English</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Created Date</p>
//               <p className="font-medium">2025-09-15</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Due Date</p>
//               <p className="font-medium">2025-09-18</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Tags</p>
//               <div className="flex gap-2 mt-1">
//                 <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
//                   Safety
//                 </span>
//                 <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
//                   Planning
//                 </span>
//               </div>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Priority & Status</p>
//               <div className="flex gap-2 mt-1">
//                 <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">
//                   High
//                 </span>
//                 <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs">
//                   Pending
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
// </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Edit, Share2, Archive, X } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chat from "../assets/chat.png";

export default function DocumentDetails() {
  const [notes, setNotes] = useState(
    "Initial review completed. Document appears comprehensive and well-structured."
  );

  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        {/* Main content + Chat sidebar */}
        <div className="flex-1 bg-gray-50 flex relative">
          {/* Chat Toggle Button */}
          <img
            src={Chat}
            alt="chat"
            onClick={() => setShowChat(true)}
            className="w-10 h-10 absolute top-10 right-6 cursor-pointer z-20"
          />

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-6 shadow-2xl p-6 m-6 rounded-2xl flex-1">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-2xl font-semibold">
                Safety Protocol Update Q4 2025
              </h1>
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                  Safety
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                  English
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 hover:text-blue-700">
                  <Edit size={16} /> Edit
                </button>
                <button className="flex items-center gap-1 hover:text-blue-700">
                  <Share2 size={16} /> Share
                </button>
                <button className="flex items-center gap-1 hover:text-red-600">
                  <Archive size={16} /> Archive
                </button>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4">
              <h2 className="font-semibold">AI-Generated Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                 ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                 aliquip ex ea commodo consequat. Duis aute irure dolor in
                 reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                 pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                 culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="bg-orange-100 border-l-4 border-orange-400 px-3 py-2 rounded text-sm text-gray-700">
                <p className="font-medium">Key insights</p>
                <p className="text-xs">
                  This document contains critical information for engineering
                  operations. Priority level is high, requiring appropriate
                  attention and follow-up actions.
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-xl p-5 space-y-3">
              <h2 className="font-semibold">Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded-md p-2 bg-gray-100 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={4}
              />
              <button className="bg-[#003366] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                Save notes
              </button>
            </div>

            {/* Document Details */}
            <div className="bg-white rounded-2xl shadow-xl p-5">
              <h2 className="font-semibold mb-4">Document Details</h2>
              <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Uploaded by</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Language</p>
                  <p className="font-medium">English</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="font-medium">2025-09-15</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="font-medium">2025-09-18</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tags</p>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                      Safety
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                      Planning
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Priority & Status</p>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">
                      High
                    </span>
                    <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col absolute right-0 top-0 h-full z-30 animate-slideIn">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-[#003366]">
                <h2 className="font-semibold text-white">Ask Sookshma</h2>
                <button onClick={() => setShowChat(false)}>
                  <X className="text-gray-100 hover:text-red-500" size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="bg-gray-300 p-3 font-medium rounded-lg text-sm text-gray-700">
                  Hello! I can help you with questions about this document. What
                  would you like to know?
                </div>
              </div>

              {/* Input */}
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full border bg-gray-100 rounded-lg px-3 py-2 mb-4  text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              <div className="p-4 border-t bg-[#003366]" >
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
