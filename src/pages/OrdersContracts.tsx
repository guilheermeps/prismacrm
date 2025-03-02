
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import OrdersTab from "@/components/orders-contracts/OrdersTab";
import ContractsTab from "@/components/orders-contracts/ContractsTab";
import ProductsTab from "@/components/orders-contracts/ProductsTab";
import FinancialTab from "@/components/orders-contracts/FinancialTab";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { FinancialTransaction } from "./Financial";

// Extend the Lead type to include necessary fields for order/contract creation
interface SourceEntity {
  leadId?: string;
  leadName?: string;
  type: string;
  amount?: number;
}

const OrdersContracts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedLead, setSelectedLead] = useState<SourceEntity | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's query param to select initial tab
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['orders', 'contracts', 'products', 'financial'].includes(tab)) {
      setActiveTab(tab);
    }
    
    // Check if there's data in sessionStorage about a lead to create order/contract from
    const orderFromLeadData = sessionStorage.getItem('createOrderFromLead');
    const contractFromLeadData = sessionStorage.getItem('createContractFromLead');
    
    if (orderFromLeadData) {
      try {
        const leadData = JSON.parse(orderFromLeadData);
        setSelectedLead(leadData);
        setActiveTab('orders');
        sessionStorage.removeItem('createOrderFromLead');
      } catch (error) {
        console.error("Failed to parse lead data for order:", error);
      }
    } else if (contractFromLeadData) {
      try {
        const leadData = JSON.parse(contractFromLeadData);
        setSelectedLead(leadData);
        setActiveTab('contracts');
        sessionStorage.removeItem('createContractFromLead');
      } catch (error) {
        console.error("Failed to parse lead data for contract:", error);
      }
    }
  }, [location.search]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Create financial transaction when order or contract is created
  const createFinancialTransaction = async (
    client: string, 
    amount: number, 
    dueDate: string, 
    sourceId: string, 
    sourceType: 'order' | 'contract',
    paymentMethod: string = 'Dinheiro',
    totalInstallments: number = 1
  ) => {
    try {
      const transaction: Omit<FinancialTransaction, 'id' | 'created_at'> = {
        client,
        amount,
        due_date: dueDate,
        category: sourceType === 'order' ? 'Pedido' : 'Contrato',
        payment_method: paymentMethod,
        total_installments: totalInstallments,
        type: 'receivable',
        status: 'pending',
        source_id: sourceId,
        source_type: sourceType
      };

      const { error } = await supabase
        .from('financial_transactions')
        .insert(transaction);

      if (error) {
        throw error;
      }

      toast.success('Transação financeira criada com sucesso');
    } catch (error: any) {
      console.error('Error creating financial transaction:', error.message);
      toast.error('Erro ao criar transação financeira');
    }
  };

  // Handle new order creation
  const handleCreateOrder = (
    orderId: string, 
    clientName: string, 
    totalAmount: number, 
    dueDate: string,
    paymentMethod: string,
    installments: number
  ) => {
    createFinancialTransaction(
      clientName,
      totalAmount,
      dueDate,
      orderId,
      'order',
      paymentMethod,
      installments
    );
    
    // Update lead history if order was created from a lead
    if (selectedLead && selectedLead.leadId) {
      updateLeadHistory(
        selectedLead.leadId,
        'create_order',
        `Pedido criado no valor de ${formatCurrency(totalAmount)}`
      );
    }
    
    setSelectedLead(null);
  };

  // Handle new contract creation
  const handleCreateContract = (
    contractId: string, 
    clientName: string, 
    totalAmount: number, 
    dueDate: string,
    paymentMethod: string,
    installments: number
  ) => {
    createFinancialTransaction(
      clientName,
      totalAmount,
      dueDate,
      contractId,
      'contract',
      paymentMethod,
      installments
    );
    
    // Update lead history if contract was created from a lead
    if (selectedLead && selectedLead.leadId) {
      updateLeadHistory(
        selectedLead.leadId,
        'create_contract',
        `Contrato criado no valor de ${formatCurrency(totalAmount)}`
      );
    }
    
    setSelectedLead(null);
  };

  // Helper function to update lead history
  const updateLeadHistory = async (leadId: string, action: string, details: string) => {
    try {
      // First, get the current lead data
      const { data: leadData, error: fetchError } = await supabase
        .from('leads')
        .select('history')
        .eq('id', leadId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching lead history:", fetchError);
        return;
      }
      
      // Prepare the history entry
      const historyEntry = {
        action,
        details,
        timestamp: new Date().toISOString()
      };
      
      // Update the lead with the new history entry
      const history = leadData.history ? [...leadData.history, historyEntry] : [historyEntry];
      
      const { error: updateError } = await supabase
        .from('leads')
        .update({ history })
        .eq('id', leadId);
      
      if (updateError) {
        console.error("Error updating lead history:", updateError);
      }
    } catch (error) {
      console.error("Error in updateLeadHistory:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleOrdersTabClick = () => {
    setActiveTab('orders');
    navigate('/orders-contracts?tab=orders');
  };

  const handleContractsTabClick = () => {
    setActiveTab('contracts');
    navigate('/orders-contracts?tab=contracts');
  };

  const handleProductsTabClick = () => {
    setActiveTab('products');
    navigate('/orders-contracts?tab=products');
  };

  const handleFinancialTabClick = () => {
    setActiveTab('financial');
    navigate('/orders-contracts?tab=financial');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="orders" onClick={handleOrdersTabClick}>
                  Pedidos
                </TabsTrigger>
                <TabsTrigger value="contracts" onClick={handleContractsTabClick}>
                  Contratos
                </TabsTrigger>
                <TabsTrigger value="products" onClick={handleProductsTabClick}>
                  Produtos
                </TabsTrigger>
                <TabsTrigger value="financial" onClick={handleFinancialTabClick}>
                  Financeiro
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="bg-card rounded-lg p-4">
                <OrdersTab 
                  onCreateOrder={handleCreateOrder}
                  leadData={selectedLead}
                />
              </TabsContent>
              
              <TabsContent value="contracts" className="bg-card rounded-lg p-4">
                <ContractsTab 
                  onCreateContract={handleCreateContract}
                  leadData={selectedLead}
                />
              </TabsContent>
              
              <TabsContent value="products" className="bg-card rounded-lg p-4">
                <ProductsTab />
              </TabsContent>
              
              <TabsContent value="financial" className="bg-card rounded-lg p-4">
                <FinancialTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersContracts;
