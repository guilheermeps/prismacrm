
import React, { useState } from "react";
import { CreditCard, Filter, ArrowDownUp, Calendar, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { upcomingPayments } from "@/utils/mockData";

// Dados financeiros vazios para inicialização
const emptyFinancialData = {
  transactions: [],
  summary: {
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0
  },
  byCategory: [
    { name: "Casamento", value: 0 },
    { name: "Ensaio", value: 0 },
    { name: "Evento", value: 0 },
    { name: "Impressão", value: 0 }
  ],
  monthly: [
    { month: "Jan", received: 0, expected: 0 },
    { month: "Fev", received: 0, expected: 0 },
    { month: "Mar", received: 0, expected: 0 },
    { month: "Abr", received: 0, expected: 0 },
    { month: "Mai", received: 0, expected: 0 },
    { month: "Jun", received: 0, expected: 0 },
  ]
};

// Cores para o gráfico de pizza
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

const FinancialTab = () => {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Usar dados de pagamentos da mockData
  const transactions = upcomingPayments.map((payment, index) => ({
    id: payment.id || index + 1,
    date: payment.dueDate,
    type: payment.type === 'receivable' ? 'Pedido' : 'Despesa',
    reference: `#PAY${payment.id || index + 1}`,
    client: payment.client,
    amount: payment.amount,
    status: payment.status
  }));

  // Calcular resumo financeiro
  const summary = {
    total: transactions.reduce((sum, t) => sum + t.amount, 0),
    paid: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pending: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    overdue: transactions.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0)
  };

  // Agrupar por categoria (serviço)
  const byCategory = Object.entries(
    transactions.reduce((acc: Record<string, number>, t) => {
      const category = t.type;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Dados financeiros derivados dos pagamentos
  const financialData = {
    transactions,
    summary,
    byCategory: byCategory.length > 0 ? byCategory : emptyFinancialData.byCategory,
    monthly: emptyFinancialData.monthly
  };

  // Filtrar transações com base nos filtros selecionados
  const filteredTransactions = financialData.transactions.filter(transaction => {
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || 
                        (typeFilter === "order" && transaction.type === "Pedido") ||
                        (typeFilter === "contract" && transaction.type === "Despesa");
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Cards de resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialData.summary.total)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor total de pedidos e contratos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Recebido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialData.summary.paid)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financialData.summary.total > 0 
                ? Math.round((financialData.summary.paid / financialData.summary.total) * 100)
                : 0}% do valor total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">
              Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(financialData.summary.pending)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financialData.summary.total > 0 
                ? Math.round((financialData.summary.pending / financialData.summary.total) * 100)
                : 0}% do valor total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Atrasado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(financialData.summary.overdue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financialData.summary.total > 0 
                ? Math.round((financialData.summary.overdue / financialData.summary.total) * 100)
                : 0}% do valor total
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo Financeiro Mensal</CardTitle>
            <CardDescription>
              Análise comparativa de valores recebidos vs. esperados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {financialData.monthly.every(m => m.received === 0 && m.expected === 0) ? (
                <div className="h-full flex items-center justify-center flex-col text-muted-foreground">
                  <CreditCard className="h-12 w-12 mb-4" />
                  <p>Sem dados financeiros disponíveis</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={financialData.monthly}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$${value/1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="received" name="Recebido" fill="#4ade80" />
                    <Bar dataKey="expected" name="Esperado" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>
              Valores de vendas por tipo de serviço/produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {financialData.byCategory.every(c => c.value === 0) ? (
                <div className="h-full flex items-center justify-center flex-col text-muted-foreground">
                  <CreditCard className="h-12 w-12 mb-4" />
                  <p>Sem dados de categorias disponíveis</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialData.byCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {financialData.byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Listagem de transações financeiras */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transações Financeiras</CardTitle>
            <div className="flex items-center gap-2">
              {/* Filtro por Status */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Filtro por Tipo */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center gap-2">
                    <ArrowDownUp className="h-4 w-4" />
                    <span>Tipo</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="order">Pedidos</SelectItem>
                  <SelectItem value="contract">Despesas</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Filtro por Data */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-fit">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRange ? format(dateRange, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {/* Botão de Exportar */}
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <CreditCard className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Nenhuma transação encontrada</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {transaction.reference}
                      </Button>
                    </TableCell>
                    <TableCell>{transaction.client}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Pago' :
                         transaction.status === 'pending' ? 'Pendente' :
                         'Atrasado'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTab;
