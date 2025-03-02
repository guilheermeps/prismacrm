
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths } from 'date-fns';
import { getLeads, getServiceTypes } from '@/lib/supabase/leadsService';

// Define COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#fa4d96'];

const LeadsReports = () => {
  const [period, setPeriod] = useState<string>("6");
  const [leadsByMonth, setLeadsByMonth] = useState<any[]>([]);
  const [leadsByService, setLeadsByService] = useState<any[]>([]);
  const [conversionRate, setConversionRate] = useState<any[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [convertedLeads, setConvertedLeads] = useState<number>(0);
  const [overallConversionRate, setOverallConversionRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get leads data
        const leads = await getLeads();
        const serviceTypes = await getServiceTypes();
        
        // Calculate reporting period
        const months = parseInt(period);
        const endDate = new Date();
        const startDate = subMonths(endDate, months);
        
        // Filter leads by period
        const filteredLeads = leads.filter(lead => {
          const createdAt = new Date(lead.createdAt);
          return createdAt >= startDate && createdAt <= endDate;
        });
        
        // Calculate total and converted leads
        const total = filteredLeads.length;
        const converted = filteredLeads.filter(lead => 
          lead.history && lead.history.some(h => h.action === 'converted')
        ).length;
        
        // Group leads by month
        const monthMap: Record<string, { month: string, count: number, converted: number, date: Date }> = {};
        
        filteredLeads.forEach(lead => {
          const createdAt = new Date(lead.createdAt);
          const monthKey = format(createdAt, 'yyyy-MM');
          const monthDisplay = format(createdAt, 'MMM');
          
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
              month: monthDisplay,
              count: 0,
              converted: 0,
              date: createdAt
            };
          }
          
          monthMap[monthKey].count += 1;
          
          // Count converted leads
          if (lead.history && lead.history.some(h => h.action === 'converted')) {
            monthMap[monthKey].converted += 1;
          }
        });
        
        // Convert to array and sort by date
        const monthlyData = Object.values(monthMap)
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(item => ({
            month: item.month,
            count: item.count,
            converted: item.converted,
            rate: item.count > 0 ? Math.round((item.converted / item.count) * 100) : 0
          }));
        
        // Group leads by service type
        const serviceMap: Record<string, number> = {};
        
        filteredLeads.forEach(lead => {
          const serviceType = lead.serviceType || 'Não especificado';
          if (!serviceMap[serviceType]) {
            serviceMap[serviceType] = 0;
          }
          serviceMap[serviceType] += 1;
        });
        
        // Convert to array for charting
        const serviceData = Object.entries(serviceMap).map(([name, value]) => ({
          name,
          value
        }));
        
        // Update state
        setLeadsByMonth(monthlyData);
        setLeadsByService(serviceData);
        setTotalLeads(total);
        setConvertedLeads(converted);
        setOverallConversionRate(total > 0 ? Math.round((converted / total) * 100) : 0);
        setConversionRate(monthlyData);
      } catch (error) {
        console.error("Error fetching leads data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
              {entry.name === 'Taxa' ? '%' : ''}
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
        <h2 className="text-2xl font-bold">Relatório de Leads</h2>
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
                <CardTitle className="text-lg">Total de Leads</CardTitle>
                <CardDescription>
                  Últimos {period} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalLeads}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Leads Convertidos</CardTitle>
                <CardDescription>
                  Últimos {period} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{convertedLeads}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
                <CardDescription>
                  Últimos {period} meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overallConversionRate}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Leads Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Leads</CardTitle>
              <CardDescription>
                Total de leads e conversões por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={leadsByMonth}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Total" fill="#0088FE" />
                    <Bar dataKey="converted" name="Convertidos" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Service Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Serviço</CardTitle>
                <CardDescription>
                  Leads por tipo de serviço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadsByService}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {leadsByService.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Conversion Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão Mensal</CardTitle>
                <CardDescription>
                  Evolução da taxa de conversão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={conversionRate}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis unit="%" domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        name="Taxa" 
                        stroke="#fa4d96" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
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

export default LeadsReports;
