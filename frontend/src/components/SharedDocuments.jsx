import React, { useState, useEffect } from 'react';
import axios from 'axios';

const departments = ['Engineering', 'HR', 'Finance', 'Safety', 'Legal'];

const statusColors = {
  'Pending Review': 'bg-yellow-300 text-yellow-800',
  Approved: 'bg-green-300 text-green-800',
  'Under Review': 'bg-blue-300 text-blue-800',
  Draft: 'bg-gray-300 text-gray-800',
};

export default function SharedDocuments() {
  const [activeDept, setActiveDept] = useState('Engineering');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // your auth token

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8080/api/documents/shared', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter documents by active department
        const filteredDocs = res.data.data.filter(
          (doc) => doc.department === activeDept
        );

        setDocuments(filteredDocs);
      } catch (err) {
        console.error('Error fetching shared documents:', err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [activeDept]); // refetch whenever the department changes

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

      {loading ? (
        <p>Loading documents...</p>
      ) : !documents.length ? (
        <p>No documents available for this department</p>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{doc.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`px-2 py-1 rounded text-sm ${statusColors[doc.status] || 'bg-gray-300 text-gray-800'}`}
                >
                  {doc.status}
                </span>

                {/* Optional action buttons */}
                <button className="text-green-600 hover:underline">Approve</button>
                <button className="text-red-600 hover:underline">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
