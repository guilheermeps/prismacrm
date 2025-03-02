
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths } from 'date-fns';
import { getContacts } from '@/lib/supabase/contactsService';
import { getContracts } from '@/lib/supabase/contractsService';
import { getOrders } from '@/lib/supabase/ordersService';

// Define COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#fa4d96'];

const ClientsReports = () => {
  const [period, setPeriod] = useState<string>("6");
  const [newClientsByMonth, setNewClientsByMonth] = useState<any[]>([]);
  const [clientsByCity, setClientsByCity] = useState<any[]>([]);
  const [clientsBySpend, setClientsBySpend] = useState<any[]>([]);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [activeClients, setActiveClients] = useState<number>(0);
  const [avgClientValue, setAvgClientValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get contacts data
        const contacts = await getContacts();
        const contracts = await getContracts();
        const orders = await getOrders();
        
        // Calculate reporting period
        const months = parseInt(period);
        const endDate = new Date();
        const startDate = subMonths(endDate, months);
        
        // Filter contacts by period
        const filteredContacts = contacts.filter(contact => {
          const createdAt = new Date(contact.created_at);
          return createdAt >= startDate && createdAt <= endDate;
        });
        
        // Group clients by month
        const monthMap: Record<string, { month: string, count: number, date: Date }> = {};
        
        filteredContacts.forEach(contact => {
          const createdAt = new Date(contact.created_at);
          const monthKey = format(createdAt, 'yyyy-MM');
          const monthDisplay = format(createdAt, 'MMM');
          
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
              month: monthDisplay,
              count: 0,
              date: createdAt
            };
          }
          
          monthMap[monthKey].count += 1;
        });
        
        // Convert to array and sort by date
        const monthlyData = Object.values(monthMap)
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(item => ({
            month: item.month,
            count: item.count
          }));
        
        // Group clients by city
        const cityMap: Record<string, number> = {};
        
        filteredContacts.forEach(contact => {
          const city = contact.city || 'Não especificado';
          if (!cityMap[city]) {
            cityMap[city] = 0;
          }
          cityMap[city] += 1;
        });
        
        // Convert to array for charting and sort by value
        const cityData = Object.entries(cityMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8); // Take top 8 cities
        
        // Calculate client value
        const clientValueMap: Record<string, number> = {};
        
        // Process contracts
        contracts.forEach(contract => {
          const contractDate = new Date(contract.created_at);
          if (contractDate >= startDate && contractDate <= endDate) {
            const clientId = contract.client_id;
            if (clientId) {
              if (!clientValueMap[clientId]) {
                clientValueMap[clientId] = 0;
              }
              clientValueMap[clientId] += Number(contract.total_amount);
            }
          }
        });
        
        // Process orders
        orders.forEach(order => {
          const orderDate = new Date(order.created_at);
          if (orderDate >= startDate && orderDate <= endDate) {
            const clientId = order.client_id;
            if (clientId) {
              if (!clientValueMap[clientId]) {
                clientValueMap[clientId] = 0;
              }
              clientValueMap[clientId] += Number(order.total_amount);
            }
          }
        });
        
        // Create value brackets
        const brackets = [
          { name: '< R$1.000', value: 0 },
          { name: 'R$1.000-5.000', value: 0 },
          { name: 'R$5.000-10.000', value: 0 },
          { name: 'R$10.000-20.000', value: 0 },
          { name: '> R$20.000', value: 0 }
        ];
        
        // Count clients in each bracket
        Object.values(clientValueMap).forEach(value => {
          if (value < 1000) {
            brackets[0].value += 1;
          } else if (value < 5000) {
            brackets[1].value += 1;
          } else if (value < 10000) {
            brackets[2].value += 1;
          } else if (value < 20000) {
            brackets[3].value += 1;
          } else {
            brackets[4].value += 1;
          }
        });
        
        // Calculate summary metrics
        const totalClientsCount = filteredContacts.length;
        
        // Active clients are those with transactions
        const activeClientsCount = Object.keys(clientValueMap).length;
        
        // Calculate average client value
        const totalClientValue = Object.values(clientValueMap).reduce((sum, value) => sum + value, 0);
        const averageClientValue = activeClientsCount > 0 ? totalClientValue / activeClientsCount : 0;
        
        // Update state
        setNewClientsByMonth(monthlyData);
        setClientsByCity(cityData);
        setClientsBySpend(brackets);
        setTotalClients(totalClientsCount);
        setActiveClients(activeClientsCount);
        setAvgClientValue(averageClientValue);
      } catch (error) {
        console.error("Error fetching clients data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatório de Clientes</h2>
        <div className="w-48">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Último ano</SelectItem>
              <SelectItem value="24">Últimos 2 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="animate-pulse bg-muted"></Card>
          <Card className="animate-pulse bg-muted"></Card>
          <Card className="animate-pulse bg-muted"></Card>
          <Card className="col-span-1 md:col-span-3 h-80 animate-pulse bg-muted"></Card>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de Clientes</CardTitle>
                <CardDescription>
                  Últimos {period} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalClients}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Clientes Ativos</CardTitle>
                <CardDescription>
                  Com compras no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeClients}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Valor Médio</CardTitle>
                <CardDescription>
                  Por cliente ativo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(avgClientValue)}</div>
              </CardContent>
            </Card>
          </div>

          {/* New Clients Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Novos Clientes</CardTitle>
              <CardDescription>
                Aquisição de clientes por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={newClientsByMonth}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Novos Clientes" fill="#fa4d96" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Clients by City */}
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Cidade</CardTitle>
                <CardDescription>
                  Distribuição geográfica dos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clientsByCity}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Clientes" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Clients by Spend */}
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Valor</CardTitle>
                <CardDescription>
                  Distribuição por faixa de valor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientsBySpend}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {clientsBySpend.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientsReports;
