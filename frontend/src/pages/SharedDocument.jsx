import { FileText, ClipboardList, Settings, User, DollarSign, ShieldCheck, Scale } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function SharedDocument() {
  const departments = [
    {
      name: "Engineering",
      documents: ["Track Maintenance report", "Signal System Upgrades", "Platform Safety Audit"],
      icon: Settings,
    },
    {
      name: "Procurement",
      documents: ["Purchase Orders", "Vendor Contracts", "Equipment Specifications"],
      icon: ClipboardList,
    },
    {
      name: "HR",
      documents: ["Employee Handbooks", "Training Schedule", "Performance Reviews"],
      icon: User,
    },
    {
      name: "Finance",
      documents: ["Budget Analysis Q3", "Expense Reports", "Audit Documentation"],
      icon: DollarSign,
    },
    {
      name: "Safety",
      documents: ["Incident Reports", "Accident Analysis", "Emergency Protocols"],
      icon: ShieldCheck,
    },
    {
      name: "Legal",
      documents: ["Compliance Documents", "Contract Reviews", "Legal Opinions"],
      icon: Scale,
    },
  ];

  return (
    <div className=" space-y-8">
        <Header/>

        <div className="flex gap-6">
         {/* Sidebar on the left */}
        <Sidebar/>

          {/* Main content on the right */}
        <div className="flex-1 flex justify-center ">
            <div className="w-full max-w-4xl space-y-8">
        {/* <div className="flex-1 space-y-8 "> */}
      {/* Shared Documents */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-[#003366] ">
          Shared Documents
        </h2>
        <h3 className="mb-6">Browse Document by department</h3>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex r gap-2 flex-col">
                  <dept.icon className="text-[#003366]" size={34} />
                  
                  <h3 className="font-semibold text-[#003366]">
                    {dept.name}
                  </h3>
                  
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                  25 Docs
                </span>
              </div>
                  <h2 className="mb-4">Recent Documents:</h2>

              {/* Document List */}
              <ul className="text-sm text-gray-600 space-y-1 mb-3">
                {dept.documents.map((doc, i) => (
                  <li key={i} className="truncate flex flex-row mb-2 gap-2">
                    <FileText size={16}  color="#8E8E8E"/>
                    {doc}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <p className="text-xs text-gray-400 mt-8">
                Last updated: Today Click to explore
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Statistics */}
      <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
        <h2 className="text-xl font-semibold text-[#003366] mb-6">
          Department Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3  gap-6 text-center">
          {departments.map((dept, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <dept.icon className="bg-[#003366] p-2 text-white" size={42} />
              <p className="text-sm text-gray-600">{dept.name}</p>
              <span className="text-xs text-gray-500">45 docs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
}
