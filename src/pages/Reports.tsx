
import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Download, Filter, Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { monthlyRevenue, serviceTypes } from '@/utils/mockData';

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-darker p-3 border border-studio-gray rounded-md shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-studio-orange">{`Receita: R$ ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Format a number as currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString()}`;
  };
  
  return (
    <div className="min-h-screen flex w-full bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Relatórios</h1>
              <p className="text-muted-foreground">Analise o desempenho financeiro do seu estúdio</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select defaultValue="2024">
                <SelectTrigger className="w-[180px] border-studio-gray bg-studio-gray/50">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent className="bg-darker border border-studio-gray">
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-studio-gray flex gap-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
            </div>
          </section>
          
          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-studio-gray animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Receita Total</span>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-darker border border-studio-gray">
                        <p>Receita total no ano atual</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>2024 (até o momento)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-studio-orange">
                  R$ 154.000
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-400">↑ 12%</span> vs ano anterior
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-studio-gray animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Média Mensal</span>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-darker border border-studio-gray">
                        <p>Média de receita mensal</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>2024 (até o momento)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-studio-orange">
                  R$ 19.250
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-400">↑ 8%</span> vs ano anterior
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-studio-gray animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Total de Clientes</span>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-darker border border-studio-gray">
                        <p>Número total de clientes</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>2024 (até o momento)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-studio-orange">
                  87
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-400">↑ 15%</span> vs ano anterior
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-studio-gray animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Valor Médio</span>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-darker border border-studio-gray">
                        <p>Valor médio por cliente</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>2024 (até o momento)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-studio-orange">
                  R$ 1.770
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-400">↓ 3%</span> vs ano anterior
                </p>
              </CardContent>
            </Card>
          </section>
          
          {/* Revenue Chart */}
          <section className="grid grid-cols-1 gap-6">
            <Card className="bg-card border-studio-gray animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Análise de receita ao longo do ano</CardDescription>
                </div>
                <Tabs defaultValue="bar">
                  <TabsList className="bg-studio-gray">
                    <TabsTrigger value="bar">Barras</TabsTrigger>
                    <TabsTrigger value="line">Linha</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full mt-2">
                  <Tabs defaultValue="bar">
                    <TabsContent value="bar" className="mt-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyRevenue}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={{ stroke: '#2A2F3E' }}
                            tickLine={false}
                            tick={{ fill: '#E2E8F0' }}
                          />
                          <YAxis 
                            axisLine={{ stroke: '#2A2F3E' }}
                            tickLine={false}
                            tick={{ fill: '#E2E8F0' }}
                            tickFormatter={formatCurrency}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar 
                            dataKey="revenue" 
                            name="Receita" 
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                          >
                            {monthlyRevenue.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill="#F97316" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="line" className="mt-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyRevenue}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={{ stroke: '#2A2F3E' }}
                            tickLine={false}
                            tick={{ fill: '#E2E8F0' }}
                          />
                          <YAxis 
                            axisLine={{ stroke: '#2A2F3E' }}
                            tickLine={false}
                            tick={{ fill: '#E2E8F0' }}
                            tickFormatter={formatCurrency}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            name="Receita" 
                            stroke="#F97316" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#F97316', stroke: '#F97316' }}
                            activeDot={{ r: 6, fill: '#FFBA08', stroke: '#F97316' }}
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Service Categories */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-studio-gray animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>Distribuição de serviços por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={serviceTypes}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" />
                      <XAxis 
                        type="number" 
                        axisLine={{ stroke: '#2A2F3E' }}
                        tickLine={false}
                        tick={{ fill: '#E2E8F0' }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={{ stroke: '#2A2F3E' }}
                        tickLine={false}
                        tick={{ fill: '#E2E8F0' }}
                        width={80}
                      />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        name="Quantidade" 
                        radius={[0, 4, 4, 0]}
                        animationDuration={1500}
                      >
                        {serviceTypes.map((entry, index) => {
                          const colors = ['#F97316', '#FFBA08', '#3B82F6', '#8B5CF6'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-studio-gray animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CardHeader>
                <CardTitle>Tendências Mensais</CardTitle>
                <CardDescription>Comparação de receita com metas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: 'Jan', meta: 15000, realizado: 12000 },
                        { month: 'Fev', meta: 15000, realizado: 15000 },
                        { month: 'Mar', meta: 18000, realizado: 18000 },
                        { month: 'Abr', meta: 18000, realizado: 14000 },
                        { month: 'Mai', meta: 20000, realizado: 16000 },
                        { month: 'Jun', meta: 20000, realizado: 20000 },
                        { month: 'Jul', meta: 22000, realizado: 22000 },
                        { month: 'Ago', meta: 22000, realizado: 19000 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={{ stroke: '#2A2F3E' }}
                        tickLine={false}
                        tick={{ fill: '#E2E8F0' }}
                      />
                      <YAxis 
                        axisLine={{ stroke: '#2A2F3E' }}
                        tickLine={false}
                        tick={{ fill: '#E2E8F0' }}
                        tickFormatter={formatCurrency}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="meta" 
                        name="Meta" 
                        stroke="#FFBA08" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#FFBA08', stroke: '#FFBA08' }}
                        animationDuration={1500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="realizado" 
                        name="Realizado" 
                        stroke="#F97316" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#F97316', stroke: '#F97316' }}
                        activeDot={{ r: 6, fill: '#FFBA08', stroke: '#F97316' }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Reports;
