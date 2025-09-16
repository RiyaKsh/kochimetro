import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HeaderComponent from '../components/HeaderComponent';
import DashboardHeader from '../components/DashboardHeader';
import DepartmentDocs from '../components/DepartmentDocs';
import ComplianceTracker from '../components/ComplianceTracker';
import Overview from '../components/Overview';
import SharedDocuments from '../components/SharedDocuments';
import UploadDocument from '../components/UploadDocument';
import KnowledgeBase from '../components/KnowledgeBase';


export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return <Overview />;
      case 'departmentDocs':
        return <DepartmentDocs />;
      case 'compliance':
        return <ComplianceTracker />;
      case 'sharedDocs':
        return <SharedDocuments />;
      case 'knowledgeBase':
        return <KnowledgeBase />;
      case 'upload':
        return <UploadDocument />;
      default:
        return <Overview />;
    }
  };

  return (
    <div>
     <DashboardHeader/>
    
    <div className="flex min-h-screen">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
      <div className="flex-1 flex flex-col">
        <HeaderComponent />

        <main className="p-6 bg-gray-100 flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
    </div>
  );
}
