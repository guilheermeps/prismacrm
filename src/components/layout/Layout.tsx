
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header toggle={toggleSidebar} />
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-10">
        {children}
      </main>
      
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
    </div>
  );
};
