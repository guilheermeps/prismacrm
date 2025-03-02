
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import LeadSourceCard from "@/components/dashboard/LeadSourceCard";
import ConversionChart from "@/components/dashboard/ConversionChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import GoalProgress from "@/components/dashboard/GoalProgress";
import NegotiationCard from "@/components/dashboard/NegotiationCard";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <DashboardCard 
                title="Total de Leads" 
                value="127" 
                trend="+12%" 
                trendDirection="up" 
                period="último mês"
              />
              <DashboardCard 
                title="Taxa de Conversão" 
                value="23%" 
                trend="+5%" 
                trendDirection="up" 
                period="último mês"
              />
              <DashboardCard 
                title="Receita Prevista" 
                value="R$ 89.750" 
                trend="+18%" 
                trendDirection="up" 
                period="último mês"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Conversão por Etapa</h2>
                <ConversionChart />
              </div>
              <div className="bg-card rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-4">Leads por Serviço</h2>
                <CategoryChart />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 shadow lg:col-span-1">
                <h2 className="text-lg font-semibold mb-4">Origem dos Leads</h2>
                <LeadSourceCard />
              </div>
              <div className="bg-card rounded-lg p-4 shadow lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Metas de Vendas</h2>
                <GoalProgress />
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-4 shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">Negociações em Andamento</h2>
              <NegotiationCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
