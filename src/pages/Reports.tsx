
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueReports from '@/components/reports/RevenueReports';
import LeadsReports from '@/components/reports/LeadsReports';
import ClientsReports from '@/components/reports/ClientsReports';
import { Layout } from '@/components/layout/Layout';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <Layout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Visualize dados e estatísticas sobre seus negócios
          </p>
        </div>

        <Tabs defaultValue="revenue" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4">
            <RevenueReports />
          </TabsContent>
          
          <TabsContent value="leads" className="space-y-4">
            <LeadsReports />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <ClientsReports />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
