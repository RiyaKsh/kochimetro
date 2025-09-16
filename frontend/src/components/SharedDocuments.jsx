import React, { useState } from 'react';

const departments = ['Engineering', 'HR', 'Finance', 'Safety', 'Legal'];

const sampleDocuments = [
  { title: 'Safety Protocol Update Q4 2025', date: '2025-09-13', status: 'Pending Review' },
  { title: 'Budget Allocation Report', date: '2025-09-13', status: 'Approved' },
  { title: 'Engineering Standards Manual', date: '2025-09-13', status: 'Under Review' },
  { title: 'Manual Update', date: '2025-09-13', status: 'Draft' },
];

const statusColors = {
  'Pending Review': 'bg-yellow-300 text-yellow-800',
  Approved: 'bg-green-300 text-green-800',
  'Under Review': 'bg-blue-300 text-blue-800',
  Draft: 'bg-gray-300 text-gray-800',
};

export default function SharedDocuments() {
  const [activeDept, setActiveDept] = useState('Engineering');

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      
      <h2 className="text-xl font-semibold mb-4">Department Documents</h2>

      {/* Department Tabs */}
      <div className="flex space-x-4 mb-6">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`px-4 py-2 rounded-full ${
              activeDept === dept ? 'bg-gray-300 text-black' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {sampleDocuments.map((doc, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-sm">
            <div>
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="text-sm text-gray-600">{doc.date}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded text-sm ${statusColors[doc.status]}`}>
                {doc.status}
              </span>

              <button className="text-green-600 hover:underline">Approve</button>
              <button className="text-red-600 hover:underline">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
