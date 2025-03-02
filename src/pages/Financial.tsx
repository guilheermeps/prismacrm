
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import FinancialTab from "@/components/orders-contracts/FinancialTab";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FinancialTransaction, deleteTransaction, getTransactions, updateTransaction } from "@/lib/supabase/financialService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Financial = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch financial transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const fetchedTransactions = await getTransactions();
        setTransactions(fetchedTransactions);
      } catch (error: any) {
        console.error("Error fetching financial transactions:", error.message);
        toast.error("Erro ao carregar transações financeiras");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Set up real-time subscription for new transactions
    const channel = supabase
      .channel('financial-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'financial_transactions'
      }, (payload) => {
        console.log('Financial transaction change received:', payload);
        
        // Refresh transactions after any change
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Function to update transaction status
  const handleUpdateStatus = async (id: string, status: 'pending' | 'completed' | 'canceled') => {
    try {
      const result = await updateTransaction({ id, status });
      
      if (result) {
        toast.success(`Status da transação atualizado para ${status === 'completed' ? 'Pago' : status === 'pending' ? 'Pendente' : 'Cancelado'}`);
        
        // Update local state
        setTransactions(prev => 
          prev.map(transaction => 
            transaction.id === id ? { ...transaction, status } : transaction
          )
        );
      } else {
        throw new Error("Falha ao atualizar status");
      }
    } catch (error: any) {
      console.error("Error updating transaction status:", error.message);
      toast.error("Erro ao atualizar status da transação");
    }
  };

  // Function to delete transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      const result = await deleteTransaction(id);
      
      if (result) {
        toast.success("Transação excluída com sucesso");
        // Update local state
        setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      } else {
        throw new Error("Falha ao excluir transação");
      }
    } catch (error: any) {
      console.error("Error deleting transaction:", error.message);
      toast.error("Erro ao excluir transação");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold">Financeiro</h1>
              <Button 
                onClick={() => navigate("/financial/new")} 
                size="sm" 
                className="h-9"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </div>
            
            <div className="bg-card rounded-lg p-3 md:p-5">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="receivables">A Receber</TabsTrigger>
                  <TabsTrigger value="payables">A Pagar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <FinancialTab 
                    transactions={transactions}
                    loading={loading}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteTransaction={handleDeleteTransaction}
                    filter="all"
                  />
                </TabsContent>
                
                <TabsContent value="receivables">
                  <FinancialTab 
                    transactions={transactions}
                    loading={loading}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteTransaction={handleDeleteTransaction}
                    filter="receivable"
                  />
                </TabsContent>
                
                <TabsContent value="payables">
                  <FinancialTab 
                    transactions={transactions}
                    loading={loading}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteTransaction={handleDeleteTransaction}
                    filter="payable"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Financial;
