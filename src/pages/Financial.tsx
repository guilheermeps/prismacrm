
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import FinancialTab from "@/components/orders-contracts/FinancialTab";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FinancialTransaction } from "@/lib/supabase/financialService";

const Financial = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch financial transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('financial_transactions')
          .select('*')
          .order('due_date', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          // Map the database record format to our FinancialTransaction interface
          const mappedTransactions: FinancialTransaction[] = data.map(item => ({
            id: item.id,
            type: item.type as 'receivable' | 'payable',
            client: item.client,
            dueDate: item.due_date,
            paymentMethod: item.payment_method,
            sourceId: item.source_id,
            sourceType: item.source_type as 'order' | 'contract' | 'manual' | undefined,
            status: item.status as 'pending' | 'completed' | 'canceled',
            amount: item.amount,
            category: item.category,
            totalInstallments: item.total_installments
          }));
          
          setTransactions(mappedTransactions);
        }
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
  const updateTransactionStatus = async (id: string, status: 'pending' | 'completed') => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success(`Status da transação atualizado para ${status === 'completed' ? 'Pago' : 'Pendente'}`);
      
      // Update local state
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? { ...transaction, status } : transaction
        )
      );
    } catch (error: any) {
      console.error("Error updating transaction status:", error.message);
      toast.error("Erro ao atualizar status da transação");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Financeiro</h1>
            <div className="bg-card rounded-lg p-3 md:p-5">
              <FinancialTab 
                transactions={transactions}
                loading={loading}
                onUpdateStatus={updateTransactionStatus}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Financial;
