
import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { userProfile } from '@/utils/mockData';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import GoalProgress from '@/components/dashboard/GoalProgress';
import CategoryChart from '@/components/dashboard/CategoryChart';
import ConversionChart from '@/components/dashboard/ConversionChart';
import NegotiationCard from '@/components/dashboard/NegotiationCard';
import LeadSourceCard from '@/components/dashboard/LeadSourceCard';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex w-full bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto w-full animate-fade-in overflow-auto">
          {/* Welcome Banner */}
          <section className="flex items-center justify-between bg-darker rounded-lg md:rounded-xl p-4 md:p-6 border border-studio-gray">
            <div className="space-y-1">
              <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2 flex-wrap">
                Bem-vindo, {userProfile.name}! <Rocket className="h-5 w-5 md:h-6 md:w-6 text-studio-orange animate-pulse" />
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Confira o desempenho do seu estúdio hoje
              </p>
            </div>
          </section>
          
          {/* Monthly Goal */}
          <section>
            <DashboardCard title="Meta de Janeiro" fullWidth delay="0.1s">
              <GoalProgress />
            </DashboardCard>
          </section>
          
          {/* Dashboard Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <DashboardCard title="Em negociação" delay="0.2s">
              <NegotiationCard />
            </DashboardCard>
            
            <DashboardCard title="Origem do Lead" delay="0.3s">
              <LeadSourceCard />
            </DashboardCard>
            
            <DashboardCard title="Conversão de vendas" delay="0.4s">
              <div className="h-[180px] md:h-[220px]">
                <ConversionChart />
              </div>
            </DashboardCard>
            
            <DashboardCard title="Tipo de trabalho" delay="0.5s">
              <div className="h-[180px] md:h-[220px]">
                <CategoryChart />
              </div>
            </DashboardCard>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
