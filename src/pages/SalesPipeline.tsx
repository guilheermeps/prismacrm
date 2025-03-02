
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import SalesFunnel from "@/components/sales-pipeline/SalesFunnel";
import SalesFunnelStats from "@/components/sales-pipeline/SalesFunnelStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadOperationsProvider } from "@/components/sales-pipeline/hooks/useLeadOperations";

const SalesPipeline = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("active");
  const [filterType, setFilterType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-full mx-auto">
            <h1 className="text-2xl font-bold mb-4">Pipeline de Vendas</h1>
            
            <LeadOperationsProvider>
              <SalesFunnelStats />
              
              <div className="mt-6 space-y-4">
                <Tabs defaultValue="active" onValueChange={setCurrentView}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <TabsList>
                      <TabsTrigger value="active">Leads Ativos</TabsTrigger>
                      <TabsTrigger value="archived">Leads Arquivados</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Buscar leads..."
                          className="pl-8 w-full"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Tipo de Serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="Casamento">Casamento</SelectItem>
                            <SelectItem value="Ensaio Fotográfico">Ensaio Fotográfico</SelectItem>
                            <SelectItem value="Evento Corporativo">Evento Corporativo</SelectItem>
                            <SelectItem value="Book">Book</SelectItem>
                            <SelectItem value="Evento Social">Evento Social</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="today">Hoje</SelectItem>
                            <SelectItem value="week">Esta Semana</SelectItem>
                            <SelectItem value="month">Este Mês</SelectItem>
                            <SelectItem value="quarter">Último Trimestre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <TabsContent value="active" className="m-0">
                    <SalesFunnel 
                      searchTerm={searchTerm} 
                      serviceTypeFilter={filterType !== "all" ? filterType : null}
                      dateFilter={dateFilter}
                      isArchived={false}
                    />
                  </TabsContent>
                  
                  <TabsContent value="archived" className="m-0">
                    <SalesFunnel 
                      searchTerm={searchTerm} 
                      serviceTypeFilter={filterType !== "all" ? filterType : null}
                      dateFilter={dateFilter}
                      isArchived={true}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </LeadOperationsProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesPipeline;
