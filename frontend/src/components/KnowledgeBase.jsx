import React from 'react';

export default function KnowledgeBase() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      
      <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
      
      <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
        <label className="block mb-2 text-gray-700 font-medium">
          AI-Powered Search
        </label>
        <input
          type="text"
          placeholder="Search knowledge base with natural language..."
          className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#015940]"
        />
        <p className="mt-2 text-sm text-gray-500">
          Archive of past documents with AI-generated summaries and searchable content.
        </p>
      </div>
      
    </div>
  );
}

