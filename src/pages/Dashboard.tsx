
import React from 'react';
import { Layout } from "@/components/layout/Layout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import LeadSourceCard from "@/components/dashboard/LeadSourceCard";
import ConversionChart from "@/components/dashboard/ConversionChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import GoalProgress from "@/components/dashboard/GoalProgress";
import NegotiationCard from "@/components/dashboard/NegotiationCard";
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { 
    isLoading, 
    conversionRate, 
    negotiations, 
    refetchData 
  } = useDashboardData();

  return (
    <Layout>
      <main className="flex-1 overflow-auto p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
            <button 
              onClick={() => refetchData()} 
              className="text-sm text-primary hover:underline"
            >
              Atualizar Dados
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {isLoading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : (
              <>
                <DashboardCard 
                  title="Total de Leads" 
                  value="127" 
                  trend="+12%" 
                  trendDirection="up" 
                  period="último mês"
                />
                <DashboardCard 
                  title="Taxa de Conversão" 
                  value={`${conversionRate}%`}
                  trend="+5%" 
                  trendDirection="up" 
                  period="último mês"
                />
                <DashboardCard 
                  title="Receita Prevista" 
                  value={`R$ ${negotiations.total.toLocaleString('pt-BR')}`}
                  trend="+18%" 
                  trendDirection="up" 
                  period="último mês"
                />
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold mb-4">Conversão por Etapa</h2>
              {isLoading ? (
                <Skeleton className="h-60 w-full" />
              ) : (
                <ConversionChart />
              )}
            </div>
            <div className="bg-card rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold mb-4">Leads por Serviço</h2>
              {isLoading ? (
                <Skeleton className="h-60 w-full" />
              ) : (
                <CategoryChart />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 shadow lg:col-span-1">
              <h2 className="text-lg font-semibold mb-4">Origem dos Leads</h2>
              {isLoading ? (
                <Skeleton className="h-60 w-full" />
              ) : (
                <LeadSourceCard />
              )}
            </div>
            <div className="bg-card rounded-lg p-4 shadow lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Metas de Vendas</h2>
              {isLoading ? (
                <Skeleton className="h-60 w-full" />
              ) : (
                <GoalProgress />
              )}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Negociações em Andamento</h2>
            {isLoading ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              <NegotiationCard />
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
