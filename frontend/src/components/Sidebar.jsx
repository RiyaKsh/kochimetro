export default function Sidebar({ selectedTab, setSelectedTab }) {
  return (
    <aside className="w-64 bg-[#015940CC] min-h-screen p-4 text-white">
      <h1 className="text-xl font-bold mb-6">KMRL Admin</h1>
      
      <button
        onClick={() => setSelectedTab('overview')}
        className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'overview' ? 'bg-black' : 'hover:bg-[#015940]'}`}
      >
        Dashboard Overview
      </button>

      <button
        onClick={() => setSelectedTab('departmentDocs')}
        className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'departmentDocs' ? 'bg-black' : 'hover:bg-[#015940]'}`}
      >
        Department Documents
      </button>

      <button
        onClick={() => setSelectedTab('compliance')}
        className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'compliance' ? 'bg-black' : 'hover:bg-[#015940]'}`}
      >
        Employees
      </button>

      <button
        onClick={() => setSelectedTab('sharedDocs')}
        className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'sharedDocs' ? 'bg-black' : 'hover:bg-[#015940]'}`}
      >
        Shared Documents
      </button>

      <button
        onClick={() => setSelectedTab('knowledgeBase')}
        className={`w-full text-left p-2 mb-2 rounded ${selectedTab === 'knowledgeBase' ? 'bg-black' : 'hover:bg-[#015940]'}`}
      >
        Knowledge Base
      </button>

      <button
        onClick={() => setSelectedTab('upload')}
        className={`w-full text-left p-2 mt-4 rounded border border-white ${selectedTab === 'upload' ? 'bg-black' : 'hover:bg-[#015940]'}`}
      >
        Upload Document
      </button>
    </aside>
  );
}
