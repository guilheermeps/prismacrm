
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getContracts } from '@/lib/supabase/contractsService';
import { getOrders } from '@/lib/supabase/ordersService';

// Define helper types
type RevenueByMonth = {
  month: string;
  revenue: number;
  date: Date; // For sorting
};

type RevenueBySource = {
  name: string;
  value: number;
};

// Define COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RevenueReports = () => {
  const [period, setPeriod] = useState<string>("6");
  const [revenueData, setRevenueData] = useState<RevenueByMonth[]>([]);
  const [revenueBySource, setRevenueBySource] = useState<RevenueBySource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [avgRevenue, setAvgRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get contracts and orders
        const contracts = await getContracts();
        const orders = await getOrders();
        
        // Calculate data by month
        const months = parseInt(period);
        const endDate = new Date();
        const startDate = subMonths(endDate, months);
        
        // Create month buckets
        const monthBuckets: Record<string, RevenueByMonth> = {};
        let totalAmount = 0;
        
        // Process contracts
        contracts.forEach(contract => {
          const contractDate = new Date(contract.created_at);
          if (contractDate >= startDate && contractDate <= endDate) {
            const monthKey = format(contractDate, 'yyyy-MM');
            if (!monthBuckets[monthKey]) {
              monthBuckets[monthKey] = {
                month: format(contractDate, 'MMM'),
                revenue: 0,
                date: contractDate
              };
            }
            monthBuckets[monthKey].revenue += Number(contract.total_amount);
            totalAmount += Number(contract.total_amount);
          }
        });
        
        // Process orders
        orders.forEach(order => {
          const orderDate = new Date(order.created_at);
          if (orderDate >= startDate && orderDate <= endDate) {
            const monthKey = format(orderDate, 'yyyy-MM');
            if (!monthBuckets[monthKey]) {
              monthBuckets[monthKey] = {
                month: format(orderDate, 'MMM'),
                revenue: 0,
                date: orderDate
              };
            }
            monthBuckets[monthKey].revenue += Number(order.total_amount);
            totalAmount += Number(order.total_amount);
          }
        });
        
        // Convert to array and sort by date
        const monthlyData = Object.values(monthBuckets).sort((a, b) => 
          a.date.getTime() - b.date.getTime()
        );
        
        // Calculate average
        const avgMonthlyRevenue = monthlyData.length > 0 ? 
          totalAmount / monthlyData.length : 0;
        
        // Calculate revenue by source
        const contractRevenue = contracts
          .filter(c => new Date(c.created_at) >= startDate && new Date(c.created_at) <= endDate)
          .reduce((sum, contract) => sum + Number(contract.total_amount), 0);
          
        const orderRevenue = orders
          .filter(o => new Date(o.created_at) >= startDate && new Date(o.created_at) <= endDate)
          .reduce((sum, order) => sum + Number(order.total_amount), 0);
          
        const sourceData = [
          { name: 'Contratos', value: contractRevenue },
          { name: 'Pedidos', value: orderRevenue }
        ];
        
        // Update state
        setRevenueData(monthlyData);
        setRevenueBySource(sourceData);
        setTotalRevenue(totalAmount);
        setAvgRevenue(avgMonthlyRevenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
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

  // Custom tooltip for the area chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-primary">{`Receita: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-primary">{`Receita: ${formatCurrency(payload[0].value)}`}</p>
          <p>{`${Math.round((payload[0].value / totalRevenue) * 100)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatório de Receitas</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="col-span-1 md:col-span-2 h-80 animate-pulse bg-muted"></Card>
          <Card className="h-60 animate-pulse bg-muted"></Card>
          <Card className="h-60 animate-pulse bg-muted"></Card>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Receita Total</CardTitle>
                <CardDescription>
                  Últimos {period} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Média Mensal</CardTitle>
                <CardDescription>
                  Últimos {period} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(avgRevenue)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Chart */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>
                Evolução da receita nos últimos {period} meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0088FE" 
                      fill="#0088FE" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Fonte</CardTitle>
                <CardDescription>
                  Distribuição da receita total por fonte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de Fontes</CardTitle>
                <CardDescription>
                  Comparação entre diferentes fontes de receita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueBySource}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `R$ ${value}`} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Receita"]} />
                      <Bar dataKey="value" name="Receita">
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
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

export default RevenueReports;
