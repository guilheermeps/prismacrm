
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

// Mock data
const mockLeads = [
  { id: 1, name: 'Website Redesign', value: 5000, serviceType: 'Website', status: 'qualified', createdAt: '2023-03-15' },
  { id: 2, name: 'Marketing Campaign', value: 7500, serviceType: 'Marketing', status: 'discovery', createdAt: '2023-03-20' },
  { id: 3, name: 'Mobile App Development', value: 12000, serviceType: 'App Development', status: 'proposal', createdAt: '2023-03-10' },
  { id: 4, name: 'SEO Optimization', value: 3000, serviceType: 'SEO', status: 'qualified', createdAt: '2023-03-05' },
  { id: 5, name: 'Brand Identity', value: 8000, serviceType: 'Branding', status: 'discovery', createdAt: '2023-02-28' },
  { id: 6, name: 'E-commerce Setup', value: 10000, serviceType: 'E-commerce', status: 'qualified', createdAt: '2023-02-20' },
  { id: 7, name: 'Content Creation', value: 2500, serviceType: 'Content', status: 'discovery', createdAt: '2023-02-15' },
  { id: 8, name: 'Social Media Strategy', value: 4500, serviceType: 'Social Media', status: 'proposal', createdAt: '2023-02-10' },
];

interface Lead {
  id: number;
  name: string;
  value: number;
  serviceType: string;
  status: string;
  createdAt: string;
}

const COLORS = ['#FFBA08', '#3E8A80', '#E26530', '#9B2915', '#2A2F3E', '#1A1F2C'];

const LeadsReports = () => {
  const [timeRange, setTimeRange] = useState('30');
  
  // Filter leads based on time range
  const filteredLeads = mockLeads.filter(lead => {
    const date = new Date(lead.createdAt);
    if (timeRange === '7') {
      return date >= subDays(new Date(), 7);
    } else if (timeRange === '30') {
      return date >= subDays(new Date(), 30);
    } else if (timeRange === '90') {
      return date >= subDays(new Date(), 90);
    } else if (timeRange === '180') {
      return date >= subDays(new Date(), 180);
    } else {
      return date >= subMonths(new Date(), 12);
    }
  });

  // Group leads by status
  const leadsByStatus = filteredLeads.reduce((acc: any, lead) => {
    if (!acc[lead.status]) {
      acc[lead.status] = 0;
    }
    acc[lead.status] += 1;
    return acc;
  }, {});

  const statusData = Object.keys(leadsByStatus).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: leadsByStatus[status]
  }));

  // Sum lead values by service type
  const leadValueByServiceType = filteredLeads.reduce((acc: any, lead) => {
    if (!acc[lead.serviceType]) {
      acc[lead.serviceType] = 0;
    }
    acc[lead.serviceType] += lead.value;
    return acc;
  }, {});

  const serviceTypeData = Object.keys(leadValueByServiceType).map(type => ({
    name: type,
    value: leadValueByServiceType[type]
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Análise de Leads</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
            <SelectItem value="180">Últimos 180 dias</SelectItem>
            <SelectItem value="365">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads por Status</CardTitle>
            <CardDescription>Distribuição de leads por estágio no funil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Valor de Leads por Tipo de Serviço</CardTitle>
            <CardDescription>Valor total por categoria de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceTypeData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor Total']} />
                  <Bar dataKey="value" fill="#FFBA08" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Leads</CardTitle>
          <CardDescription>Quantidade de leads ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Jan', count: 4 },
                  { name: 'Fev', count: 3 },
                  { name: 'Mar', count: 8 },
                  { name: 'Abr', count: 6 },
                  { name: 'Mai', count: 5 },
                  { name: 'Jun', count: 9 },
                ]}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3E8A80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsReports;
