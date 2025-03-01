
import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, LineChart, Line, PieChart, Pie } from 'recharts';
import { Calendar, Download, Filter, FileText, BarChart3, FileSpreadsheet, Info, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { monthlyRevenue, serviceTypes, leadSources } from '@/utils/mockData';
import { toast } from "sonner";

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [activeDetailView, setActiveDetailView] = useState("");
  const [reportPeriod, setReportPeriod] = useState("2024");
  
  // Mock data for dashboard cards
  const dashboardData = {
    revenue: {
      total: 154000,
      change: 12,
      trend: "up"
    },
    avgMonthly: {
      total: 19250,
      change: 8,
      trend: "up"
    },
    clients: {
      total: 87,
      change: 15,
      trend: "up"
    },
    avgTicket: {
      total: 1770,
      change: -3,
      trend: "down"
    }
  };
  
  // Sales data for various reports
  const salesData = [
    { month: 'Jan', revenue: 12500, orders: 15, contracts: 3 },
    { month: 'Fev', revenue: 15000, orders: 18, contracts: 4 },
    { month: 'Mar', revenue: 18000, orders: 22, contracts: 5 },
    { month: 'Abr', revenue: 14000, orders: 16, contracts: 3 },
    { month: 'Mai', revenue: 16000, orders: 19, contracts: 4 },
    { month: 'Jun', revenue: 20000, orders: 24, contracts: 6 },
    { month: 'Jul', revenue: 22000, orders: 26, contracts: 7 },
    { month: 'Ago', revenue: 19000, orders: 23, contracts: 5 },
  ];
  
  // Mock data for the detailed reports section
  const ordersData = [
    { id: "ORD001", client: "Maria Silva", service: "Ensaio Fotográfico", date: "10/04/2024", value: 1200, status: "Concluído" },
    { id: "ORD002", client: "João Pereira", service: "Casamento", date: "15/04/2024", value: 5000, status: "Em andamento" },
    { id: "ORD003", client: "Camila Oliveira", service: "Evento Corporativo", date: "20/04/2024", value: 3500, status: "Agendado" },
    { id: "ORD004", client: "Ricardo Santos", service: "Ensaio LinkedIn", date: "05/05/2024", value: 800, status: "Concluído" },
    { id: "ORD005", client: "Fernando Lima", service: "Casamento", date: "12/06/2024", value: 6500, status: "Agendado" },
  ];
  
  const clientsData = [
    { id: "CLI001", name: "Maria Silva", purchases: 2, totalSpent: 2400, lastPurchase: "10/04/2024" },
    { id: "CLI002", name: "João Pereira", purchases: 1, totalSpent: 5000, lastPurchase: "15/04/2024" },
    { id: "CLI003", name: "Camila Oliveira", purchases: 3, totalSpent: 8500, lastPurchase: "20/04/2024" },
    { id: "CLI004", name: "Ricardo Santos", purchases: 1, totalSpent: 800, lastPurchase: "05/05/2024" },
    { id: "CLI005", name: "Fernando Lima", purchases: 2, totalSpent: 9500, lastPurchase: "12/06/2024" },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.dataKey.includes('revenue') ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Format a number as currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString()}`;
  };
  
  // Handle exporting reports
  const handleExportReport = (type: 'pdf' | 'excel') => {
    const format = type === 'pdf' ? 'PDF' : 'Excel';
    toast.success(`Relatório exportado com sucesso em formato ${format}.`);
  };
  
  // Handle showing detailed view
  const showDetailView = (viewName: string) => {
    setActiveView("details");
    setActiveDetailView(viewName);
  };
  
  // Helper function to render trend indicators
  const renderTrend = (change: number, trend: 'up' | 'down' | 'neutral') => {
    const color = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
    const icon = trend === 'up' ? <ArrowUp className="h-4 w-4" /> : 
                 trend === 'down' ? <ArrowDown className="h-4 w-4" /> : 
                 <ChevronsUpDown className="h-4 w-4" />;
    
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Relatórios</h1>
                <p className="text-muted-foreground">Análise de desempenho e métricas de negócio</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="ytd">2024 (até hoje)</SelectItem>
                    <SelectItem value="last30">Últimos 30 dias</SelectItem>
                    <SelectItem value="last90">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="flex gap-2 items-center" onClick={() => handleExportReport('pdf')}>
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </Button>
                
                <Button variant="outline" className="flex gap-2 items-center" onClick={() => handleExportReport('excel')}>
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                </Button>
              </div>
            </section>
            
            {/* Main tabs for Reports and Dashboard */}
            <Tabs defaultValue={activeView} value={activeView} onValueChange={setActiveView} className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>
              
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Summary Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Receita Total</span>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Receita total no período selecionado</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </CardTitle>
                      <CardDescription>{reportPeriod} (até o momento)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(dashboardData.revenue.total)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {renderTrend(dashboardData.revenue.change, dashboardData.revenue.trend as 'up' | 'down')} vs período anterior
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Média Mensal</span>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Média de receita mensal</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </CardTitle>
                      <CardDescription>{reportPeriod} (até o momento)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(dashboardData.avgMonthly.total)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {renderTrend(dashboardData.avgMonthly.change, dashboardData.avgMonthly.trend as 'up' | 'down')} vs período anterior
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Total de Clientes</span>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Número total de clientes</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </CardTitle>
                      <CardDescription>{reportPeriod} (até o momento)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboardData.clients.total}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {renderTrend(dashboardData.clients.change, dashboardData.clients.trend as 'up' | 'down')} vs período anterior
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Valor Médio</span>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Valor médio por cliente</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </CardTitle>
                      <CardDescription>{reportPeriod} (até o momento)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(dashboardData.avgTicket.total)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {renderTrend(dashboardData.avgTicket.change, dashboardData.avgTicket.trend as 'up' | 'down')} vs período anterior
                      </p>
                    </CardContent>
                  </Card>
                </section>
                
                {/* Revenue Chart */}
                <section className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Receita Mensal</CardTitle>
                        <CardDescription>Análise de receita ao longo do ano</CardDescription>
                      </div>
                      <Tabs defaultValue="bar">
                        <TabsList>
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
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <YAxis 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                  tickFormatter={formatCurrency}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar 
                                  dataKey="revenue" 
                                  name="Receita" 
                                  radius={[4, 4, 0, 0]}
                                  fill="hsl(var(--primary))"
                                  animationDuration={1500}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </TabsContent>
                          <TabsContent value="line" className="mt-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={monthlyRevenue}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <YAxis 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                  tickFormatter={formatCurrency}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="revenue" 
                                  name="Receita" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={3}
                                  dot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))" }}
                                  activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))" }}
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
                
                {/* Service Categories and Trends */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
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
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              type="number" 
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                              tickLine={false}
                            />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                              tickLine={false}
                              width={120}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                              dataKey="value" 
                              name="Quantidade" 
                              radius={[0, 4, 4, 0]}
                              animationDuration={1500}
                            >
                              {serviceTypes.map((entry, index) => {
                                const colors = [
                                  "hsl(var(--primary))",
                                  "hsl(var(--secondary))",
                                  "hsl(var(--accent))",
                                  "hsl(var(--destructive))"
                                ];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                              })}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
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
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="month" 
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                              tickLine={false}
                            />
                            <YAxis 
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                              tickLine={false}
                              tickFormatter={formatCurrency}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="meta" 
                              name="Meta" 
                              stroke="hsl(var(--secondary))" 
                              strokeDasharray="5 5"
                              strokeWidth={2}
                              dot={{ r: 4, fill: "hsl(var(--secondary))", stroke: "hsl(var(--secondary))" }}
                              animationDuration={1500}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="realizado" 
                              name="Realizado" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3}
                              dot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))" }}
                              activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))" }}
                              animationDuration={1500}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </section>
                
                {/* Lead source and conversion */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Origem dos Leads</CardTitle>
                      <CardDescription>Distribuição de leads por canal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={leadSources}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              animationDuration={1500}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {leadSources.map((entry, index) => {
                                const colors = [
                                  "hsl(var(--primary))",
                                  "hsl(var(--secondary))",
                                  "hsl(var(--accent))",
                                  "hsl(var(--destructive))"
                                ];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                              })}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Taxa de Conversão</CardTitle>
                      <CardDescription>Leads convertidos em vendas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full mt-2 flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Convertido', value: 35 },
                                { name: 'Não Convertido', value: 65 }
                              ]}
                              cx="50%"
                              cy="50%"
                              startAngle={180}
                              endAngle={0}
                              innerRadius="60%"
                              outerRadius="100%"
                              paddingAngle={0}
                              dataKey="value"
                              stroke="none"
                              animationDuration={1500}
                            >
                              <Cell fill="hsl(var(--primary))" />
                              <Cell fill="hsl(var(--muted))" />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute text-center">
                          <span className="text-4xl font-bold block">
                            35%
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Taxa de conversão
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </TabsContent>
              
              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios Personalizáveis</CardTitle>
                    <CardDescription>Selecione o tipo de relatório para analisar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="vendas" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="vendas">Vendas</TabsTrigger>
                        <TabsTrigger value="leads">Leads</TabsTrigger>
                        <TabsTrigger value="clientes">Clientes</TabsTrigger>
                        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                      </TabsList>
                      
                      {/* Sales Reports */}
                      <TabsContent value="vendas" className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                          <h3 className="text-lg font-medium">Relatório de Vendas e Serviços</h3>
                          
                          <div className="flex flex-wrap gap-2">
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tipo de serviço" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos os serviços</SelectItem>
                                <SelectItem value="casamento">Casamento</SelectItem>
                                <SelectItem value="ensaio">Ensaio Fotográfico</SelectItem>
                                <SelectItem value="evento">Evento Corporativo</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button variant="outline" className="flex gap-2 items-center">
                              <Calendar className="h-4 w-4" />
                              <span>Período</span>
                            </Button>
                            
                            <Button variant="outline" className="flex gap-2 items-center" onClick={() => showDetailView("orders")}>
                              <BarChart3 className="h-4 w-4" />
                              <span>Ver Detalhes</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="h-[350px] w-full mt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={salesData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis 
                                dataKey="month" 
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                tickLine={false}
                              />
                              <YAxis 
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                tickLine={false}
                                yAxisId="left"
                                tickFormatter={formatCurrency}
                              />
                              <YAxis 
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                tickLine={false}
                                yAxisId="right"
                                orientation="right"
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Bar 
                                yAxisId="left"
                                dataKey="revenue" 
                                name="Receita" 
                                fill="hsl(var(--primary))" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                              />
                              <Bar 
                                yAxisId="right"
                                dataKey="orders" 
                                name="Pedidos" 
                                fill="hsl(var(--secondary))" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                              />
                              <Bar 
                                yAxisId="right"
                                dataKey="contracts" 
                                name="Contratos" 
                                fill="hsl(var(--accent))" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Total de Pedidos</span>
                                <span className="text-2xl font-bold">163</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>12% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Total de Contratos</span>
                                <span className="text-2xl font-bold">37</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>8% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Receita Total</span>
                                <span className="text-2xl font-bold">{formatCurrency(154000)}</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>15% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      {/* Leads Reports */}
                      <TabsContent value="leads" className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                          <h3 className="text-lg font-medium">Relatório de Leads e Conversões</h3>
                          
                          <div className="flex flex-wrap gap-2">
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status do lead" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="novo">Novo Lead</SelectItem>
                                <SelectItem value="contato">Proposta Enviada</SelectItem>
                                <SelectItem value="negociacao">Negociação</SelectItem>
                                <SelectItem value="fechado">Fechado</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button variant="outline" className="flex gap-2 items-center">
                              <Calendar className="h-4 w-4" />
                              <span>Período</span>
                            </Button>
                            
                            <Button variant="outline" className="flex gap-2 items-center">
                              <Filter className="h-4 w-4" />
                              <span>Filtros</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={[
                                  { month: 'Jan', novos: 12, convertidos: 4 },
                                  { month: 'Fev', novos: 15, convertidos: 6 },
                                  { month: 'Mar', novos: 18, convertidos: 8 },
                                  { month: 'Abr', novos: 14, convertidos: 4 },
                                  { month: 'Mai', novos: 20, convertidos: 7 },
                                  { month: 'Jun', novos: 22, convertidos: 9 },
                                  { month: 'Jul', novos: 25, convertidos: 8 },
                                  { month: 'Ago', novos: 19, convertidos: 7 }
                                ]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <YAxis 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar 
                                  dataKey="novos" 
                                  name="Novos Leads" 
                                  fill="hsl(var(--primary))" 
                                  radius={[4, 4, 0, 0]}
                                  animationDuration={1500}
                                />
                                <Bar 
                                  dataKey="convertidos" 
                                  name="Convertidos" 
                                  fill="hsl(var(--secondary))" 
                                  radius={[4, 4, 0, 0]}
                                  animationDuration={1500}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Novo Lead', value: 25 },
                                    { name: 'Proposta Enviada', value: 35 },
                                    { name: 'Reunião Agendada', value: 15 },
                                    { name: 'Negociação', value: 10 },
                                    { name: 'Fechado (Ganho)', value: 10 },
                                    { name: 'Fechado (Perdido)', value: 5 }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="value"
                                  animationDuration={1500}
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {leadSources.map((entry, index) => {
                                    const colors = [
                                      "hsl(var(--primary))",
                                      "hsl(var(--secondary))",
                                      "hsl(var(--accent))",
                                      "hsl(var(--destructive))",
                                      "hsl(var(--muted))",
                                      "hsl(var(--card))"
                                    ];
                                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                  })}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Total de Leads</span>
                                <span className="text-2xl font-bold">145</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>18% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Taxa de Conversão</span>
                                <span className="text-2xl font-bold">35%</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>5% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Valor em Negociação</span>
                                <span className="text-2xl font-bold">{formatCurrency(68500)}</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>22% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      {/* Clients Reports */}
                      <TabsContent value="clientes" className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                          <h3 className="text-lg font-medium">Relatório de Clientes</h3>
                          
                          <div className="flex flex-wrap gap-2">
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Segmento" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos os segmentos</SelectItem>
                                <SelectItem value="pessoa">Pessoa Física</SelectItem>
                                <SelectItem value="empresa">Empresa</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button variant="outline" className="flex gap-2 items-center" onClick={() => showDetailView("clients")}>
                              <BarChart3 className="h-4 w-4" />
                              <span>Ver Detalhes</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={[
                                  { month: 'Jan', ativos: 65, novos: 8 },
                                  { month: 'Fev', ativos: 68, novos: 5 },
                                  { month: 'Mar', ativos: 72, novos: 7 },
                                  { month: 'Abr', ativos: 75, novos: 4 },
                                  { month: 'Mai', ativos: 78, novos: 6 },
                                  { month: 'Jun', ativos: 82, novos: 8 },
                                  { month: 'Jul', ativos: 85, novos: 7 },
                                  { month: 'Ago', ativos: 87, novos: 5 }
                                ]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <YAxis 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="ativos" 
                                  name="Clientes Ativos" 
                                  stroke="hsl(var(--primary))" 
                                  strokeWidth={3}
                                  dot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))" }}
                                  activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))" }}
                                  animationDuration={1500}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="novos" 
                                  name="Novos Clientes" 
                                  stroke="hsl(var(--secondary))" 
                                  strokeWidth={2}
                                  dot={{ r: 4, fill: "hsl(var(--secondary))", stroke: "hsl(var(--secondary))" }}
                                  activeDot={{ r: 6, fill: "hsl(var(--secondary))", stroke: "hsl(var(--background))" }}
                                  animationDuration={1500}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={[
                                  { name: "1 compra", value: 35 },
                                  { name: "2 compras", value: 25 },
                                  { name: "3 compras", value: 15 },
                                  { name: "4+ compras", value: 25 }
                                ]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="name" 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <YAxis 
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar 
                                  dataKey="value" 
                                  name="Número de Clientes" 
                                  fill="hsl(var(--primary))" 
                                  radius={[4, 4, 0, 0]}
                                  animationDuration={1500}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Total de Clientes</span>
                                <span className="text-2xl font-bold">87</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>15% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Taxa de Recorrência</span>
                                <span className="text-2xl font-bold">65%</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>8% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Valor Médio</span>
                                <span className="text-2xl font-bold">{formatCurrency(1770)}</span>
                                <div className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                  <ArrowDown className="h-3 w-3" />
                                  <span>3% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      {/* Financial Reports */}
                      <TabsContent value="financeiro" className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                          <h3 className="text-lg font-medium">Relatório Financeiro</h3>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="flex gap-2 items-center">
                              <Calendar className="h-4 w-4" />
                              <span>Período</span>
                            </Button>
                            
                            <Button variant="outline" className="flex gap-2 items-center">
                              <Filter className="h-4 w-4" />
                              <span>Filtros</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="h-[350px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { month: 'Jan', receitas: 12500, despesas: 8000 },
                                { month: 'Fev', receitas: 15000, despesas: 8500 },
                                { month: 'Mar', receitas: 18000, despesas: 9000 },
                                { month: 'Abr', receitas: 14000, despesas: 8200 },
                                { month: 'Mai', receitas: 16000, despesas: 8800 },
                                { month: 'Jun', receitas: 20000, despesas: 9500 },
                                { month: 'Jul', receitas: 22000, despesas: 10000 },
                                { month: 'Ago', receitas: 19000, despesas: 9200 }
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis 
                                dataKey="month" 
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                tickLine={false}
                              />
                              <YAxis 
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                tickLine={false}
                                tickFormatter={formatCurrency}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Bar 
                                dataKey="receitas" 
                                name="Receitas" 
                                fill="hsl(var(--primary))" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                              />
                              <Bar 
                                dataKey="despesas" 
                                name="Despesas" 
                                fill="hsl(var(--destructive))" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Receita Total</span>
                                <span className="text-2xl font-bold">{formatCurrency(154000)}</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>15% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Despesas Totais</span>
                                <span className="text-2xl font-bold">{formatCurrency(71200)}</span>
                                <div className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>8% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Lucro Líquido</span>
                                <span className="text-2xl font-bold">{formatCurrency(82800)}</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>22% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/20">
                            <CardContent className="p-4">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Margem de Lucro</span>
                                <span className="text-2xl font-bold">53.7%</span>
                                <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <span>3.2% vs período anterior</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Detailed View Tab */}
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>
                        {activeDetailView === "orders" ? "Detalhamento de Pedidos" : 
                         activeDetailView === "clients" ? "Detalhamento de Clientes" : 
                         "Detalhamento de Dados"}
                      </CardTitle>
                      <CardDescription>
                        Visualização detalhada dos dados do relatório
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setActiveView("reports")}>
                      Voltar para Relatórios
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {activeDetailView === "orders" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Lista de Pedidos</h3>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex gap-2 items-center" onClick={() => handleExportReport('excel')}>
                              <FileSpreadsheet className="h-4 w-4" />
                              <span>Exportar</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Serviço</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {ordersData.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell>{order.id}</TableCell>
                                  <TableCell>{order.client}</TableCell>
                                  <TableCell>{order.service}</TableCell>
                                  <TableCell>{order.date}</TableCell>
                                  <TableCell>{formatCurrency(order.value)}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      order.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                                      order.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                    
                    {activeDetailView === "clients" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Lista de Clientes</h3>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex gap-2 items-center" onClick={() => handleExportReport('excel')}>
                              <FileSpreadsheet className="h-4 w-4" />
                              <span>Exportar</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Compras</TableHead>
                                <TableHead>Total Gasto</TableHead>
                                <TableHead>Última Compra</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {clientsData.map((client) => (
                                <TableRow key={client.id}>
                                  <TableCell>{client.id}</TableCell>
                                  <TableCell>{client.name}</TableCell>
                                  <TableCell>{client.purchases}</TableCell>
                                  <TableCell>{formatCurrency(client.totalSpent)}</TableCell>
                                  <TableCell>{client.lastPurchase}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
