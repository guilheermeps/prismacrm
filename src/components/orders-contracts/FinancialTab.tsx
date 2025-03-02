
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

// Dados de exemplo baseados em pedidos e contratos
// Em um sistema real, estes dados seriam derivados da API
const mockFinancialData = {
  transactions: [
    { id: 1, date: "2024-05-01", type: "Pedido", reference: "#PED001", client: "Ana Silva", amount: 1250.00, status: "paid" },
    { id: 2, date: "2024-05-03", type: "Pedido", reference: "#PED002", client: "João Costa", amount: 850.00, status: "pending" },
    { id: 3, date: "2024-05-05", type: "Contrato", reference: "#CONT003", client: "Empresa XYZ", amount: 3500.00, status: "paid" },
    { id: 4, date: "2024-05-07", type: "Pedido", reference: "#PED004", client: "Maria Souza", amount: 975.00, status: "overdue" },
    { id: 5, date: "2024-05-10", type: "Contrato", reference: "#CONT005", client: "Carlos Mendes", amount: 2800.00, status: "pending" },
    { id: 6, date: "2024-05-12", type: "Pedido", reference: "#PED006", client: "Laura Oliveira", amount: 1450.00, status: "paid" },
    { id: 7, date: "2024-05-15", type: "Contrato", reference: "#CONT007", client: "Marcelo Lima", amount: 5000.00, status: "pending" },
  ],
  summary: {
    total: 15825.00,
    paid: 6200.00,
    pending: 8650.00,
    overdue: 975.00
  },
  byCategory: [
    { name: "Casamento", value: 7500 },
    { name: "Ensaio", value: 3200 },
    { name: "Evento", value: 4125 },
    { name: "Impressão", value: 1000 }
  ],
  monthly: [
    { month: "Jan", received: 3500, expected: 4200 },
    { month: "Fev", received: 4200, expected: 4200 },
    { month: "Mar", received: 3800, expected: 4000 },
    { month: "Abr", received: 4500, expected: 4500 },
    { month: "Mai", received: 6200, expected: 15825 },
    { month: "Jun", received: 0, expected: 8500 },
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

  // Filtrar transações com base nos filtros selecionados
  const filteredTransactions = mockFinancialData.transactions.filter(transaction => {
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || 
                        (typeFilter === "order" && transaction.type === "Pedido") ||
                        (typeFilter === "contract" && transaction.type === "Contrato");
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
              {formatCurrency(mockFinancialData.summary.total)}
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
              {formatCurrency(mockFinancialData.summary.paid)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((mockFinancialData.summary.paid / mockFinancialData.summary.total) * 100)}% do valor total
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
              {formatCurrency(mockFinancialData.summary.pending)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((mockFinancialData.summary.pending / mockFinancialData.summary.total) * 100)}% do valor total
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
              {formatCurrency(mockFinancialData.summary.overdue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((mockFinancialData.summary.overdue / mockFinancialData.summary.total) * 100)}% do valor total
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockFinancialData.monthly}
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockFinancialData.byCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockFinancialData.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
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
                  <SelectItem value="paid">Pago</SelectItem>
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
                  <SelectItem value="contract">Contratos</SelectItem>
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
                        transaction.status === 'paid' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'paid' ? 'Pago' :
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
