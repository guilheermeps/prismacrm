import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { CheckCircle, XCircle, Filter } from "lucide-react";
import { FinancialTransaction } from "@/lib/supabase/financialService";

interface FinancialTabProps {
  transactions: FinancialTransaction[];
  loading: boolean;
  onUpdateStatus: (id: string, status: 'pending' | 'completed') => Promise<void>;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ 
  transactions, 
  loading,
  onUpdateStatus 
}) => {
  const [filter, setFilter] = useState<'all' | 'receivable' | 'payable' | 'pending' | 'completed'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'receivable') return transaction.type === 'receivable';
    if (filter === 'payable') return transaction.type === 'payable';
    if (filter === 'pending') return transaction.status === 'pending';
    if (filter === 'completed') return transaction.status === 'completed';
    return true;
  });

  // Calculate totals
  const totalReceivables = transactions
    .filter(t => t.type === 'receivable' && t.status === 'pending')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalPayables = transactions
    .filter(t => t.type === 'payable' && t.status === 'pending')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">A Receber</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceivables)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">A Pagar</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPayables)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Saldo</h3>
          <p className={`text-2xl font-bold ${totalReceivables - totalPayables >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalReceivables - totalPayables)}
          </p>
        </div>
      </div>

      {/* Filter dropdown */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Transações Financeiras</h2>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select 
            value={filter} 
            onValueChange={(value) => setFilter(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as transações</SelectItem>
              <SelectItem value="receivable">A receber</SelectItem>
              <SelectItem value="payable">A pagar</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma transação encontrada.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.client}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'receivable' ? 'default' : 'destructive'}>
                      {transaction.type === 'receivable' ? 'A Receber' : 'A Pagar'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    {format(new Date(transaction.due_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{transaction.payment_method}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'completed' ? 'outline' : 'secondary'}>
                      {transaction.status === 'completed' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.status === 'pending' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUpdateStatus(transaction.id, 'completed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marcar como pago
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUpdateStatus(transaction.id, 'pending')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Marcar como pendente
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FinancialTab;
