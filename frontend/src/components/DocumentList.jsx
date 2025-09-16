// components/DocumentList.jsx
export default function DocumentList({ documents }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Recent Documents</h2>
        <button className="text-green-700">View All</button>
      </div>
      <ul>
        {documents.map((doc, idx) => (
          <li key={idx} className="flex justify-between items-center p-2 border-b">
            <div>
              <h4 className="font-medium">{doc.title}</h4>
              <p className="text-gray-500 text-sm">
                {doc.department} • {doc.date} • <span className="text-red-500">{doc.priority}</span>
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-white text-sm ${doc.statusColor}`}>
              {doc.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
