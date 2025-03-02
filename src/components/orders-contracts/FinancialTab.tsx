
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
import { CheckCircle, XCircle, Filter, Trash2, AlertCircle } from "lucide-react";
import { FinancialTransaction } from "@/lib/supabase/financialService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FinancialTabProps {
  transactions: FinancialTransaction[];
  loading: boolean;
  onUpdateStatus: (id: string, status: 'pending' | 'completed' | 'canceled') => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  filter?: 'all' | 'receivable' | 'payable';
}

const FinancialTab: React.FC<FinancialTabProps> = ({ 
  transactions, 
  loading,
  onUpdateStatus,
  onDeleteTransaction,
  filter = 'all'
}) => {
  const [localFilter, setLocalFilter] = useState<'all' | 'receivable' | 'payable' | 'pending' | 'completed' | 'canceled'>(
    filter === 'all' ? 'all' : filter
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    // First apply the parent filter if it's not 'all'
    if (filter !== 'all' && transaction.type !== filter) {
      return false;
    }
    
    // Then apply the local filter
    if (localFilter === 'all') return true;
    if (localFilter === 'receivable') return transaction.type === 'receivable';
    if (localFilter === 'payable') return transaction.type === 'payable';
    if (localFilter === 'pending') return transaction.status === 'pending';
    if (localFilter === 'completed') return transaction.status === 'completed';
    if (localFilter === 'canceled') return transaction.status === 'canceled';
    return true;
  });

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await onDeleteTransaction(transactionToDelete);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  // Calculate totals
  const totalReceivables = filteredTransactions
    .filter(t => t.type === 'receivable' && t.status === 'pending')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalPayables = filteredTransactions
    .filter(t => t.type === 'payable' && t.status === 'pending')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'outline';
      case 'pending':
        return 'secondary';
      case 'canceled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
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
            value={localFilter} 
            onValueChange={(value) => setLocalFilter(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as transações</SelectItem>
              <SelectItem value="receivable">A receber</SelectItem>
              <SelectItem value="payable">A pagar</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="completed">Pagas</SelectItem>
              <SelectItem value="canceled">Canceladas</SelectItem>
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
                    {format(new Date(transaction.dueDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {getStatusDisplay(transaction.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {transaction.status === 'pending' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onUpdateStatus(transaction.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como pago
                        </Button>
                      ) : transaction.status === 'completed' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onUpdateStatus(transaction.id, 'pending')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Marcar como pendente
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onUpdateStatus(transaction.id, 'pending')}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Reativar
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FinancialTab;
