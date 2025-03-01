
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import SalesFunnel from "@/components/sales-pipeline/SalesFunnel";
import SalesFunnelStats from "@/components/sales-pipeline/SalesFunnelStats";

const SalesPipeline = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-full mx-auto">
            <h1 className="text-2xl font-bold mb-4">Pipeline de Vendas</h1>
            <SalesFunnelStats />
            <div className="mt-6">
              <SalesFunnel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesPipeline;
