
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
import { supabase } from "@/integrations/supabase/client";
import { FinancialTransaction, createFinancialTransaction } from "@/lib/supabase/financialService";
import { createScheduleEvent } from "@/lib/supabase/schedulingService";
import { format } from "date-fns";

// Extend the Lead type to include necessary fields for order/contract creation
interface SourceEntity {
  leadId?: string;
  leadName?: string;
  id?: string; // Contact ID
  name?: string; // Contact name
  type: string;
  amount?: number;
}

// Define props for the Financial Tab
interface FinancialTabProps {
  transactions: FinancialTransaction[];
  loading: boolean;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

const OrdersContracts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedLead, setSelectedLead] = useState<SourceEntity | null>(null);
  const [selectedContact, setSelectedContact] = useState<SourceEntity | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's query param to select initial tab
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['orders', 'contracts', 'products', 'financial'].includes(tab)) {
      setActiveTab(tab);
    }
    
    // Check if there's data in sessionStorage about a lead or contact to create order/contract from
    const orderFromLeadData = sessionStorage.getItem('createOrderFromLead');
    const contractFromLeadData = sessionStorage.getItem('createContractFromLead');
    const orderFromContactData = sessionStorage.getItem('createOrderFromContact');
    const contractFromContactData = sessionStorage.getItem('createContractFromContact');
    
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
    } else if (orderFromContactData) {
      try {
        const contactData = JSON.parse(orderFromContactData);
        setSelectedContact(contactData);
        setActiveTab('orders');
        sessionStorage.removeItem('createOrderFromContact');
      } catch (error) {
        console.error("Failed to parse contact data for order:", error);
      }
    } else if (contractFromContactData) {
      try {
        const contactData = JSON.parse(contractFromContactData);
        setSelectedContact(contactData);
        setActiveTab('contracts');
        sessionStorage.removeItem('createContractFromContact');
      } catch (error) {
        console.error("Failed to parse contact data for contract:", error);
      }
    }
    
    // Load transactions for the financial tab
    loadTransactions();
  }, [location.search]);

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      const typedData = data.map(item => ({
        ...item,
        type: item.type as 'receivable' | 'payable',
        status: item.status as 'pending' | 'completed',
        source_type: item.source_type as 'order' | 'contract' | 'manual' | undefined
      }));
      
      setTransactions(typedData);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erro ao carregar transações financeiras');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Create financial transaction when order or contract is created
  const createFinancialTransactionHandler = async (
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

      const transactionId = await createFinancialTransaction(transaction);
      
      if (!transactionId) {
        throw new Error('Failed to create transaction');
      }

      toast.success('Transação financeira criada com sucesso');
      // Refresh the transactions list
      loadTransactions();
      return transactionId;
    } catch (error: any) {
      console.error('Error creating financial transaction:', error.message);
      toast.error('Erro ao criar transação financeira');
      return null;
    }
  };

  // Create schedule event from order or contract
  const createScheduleEventFromTransaction = async (
    clientName: string,
    service: string,
    eventDate: string,
    eventTime: string,
    location: string,
    sourceId: string,
    sourceType: 'order' | 'contract',
    notes?: string
  ) => {
    try {
      const event = {
        client: clientName,
        service,
        date: eventDate,
        time: eventTime,
        location,
        source_id: sourceId,
        source_type: sourceType,
        notes
      };

      const eventId = await createScheduleEvent(event);
      
      if (eventId) {
        toast.success('Evento adicionado à agenda com sucesso');
        return eventId;
      }
      return null;
    } catch (error: any) {
      console.error('Error creating schedule event:', error.message);
      toast.error('Erro ao adicionar evento à agenda');
      return null;
    }
  };

  // Handle updating financial transaction status
  const handleUpdateTransactionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Status da transação atualizado com sucesso');
      loadTransactions();
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast.error('Erro ao atualizar status da transação');
    }
  };

  // Handle new order creation
  const handleCreateOrder = (
    orderId: string, 
    clientName: string, 
    totalAmount: number, 
    dueDate: string,
    paymentMethod: string,
    installments: number,
    // Schedule parameters
    serviceType: string,
    eventDate: string,
    eventTime: string,
    location: string,
    notes?: string
  ) => {
    // Create financial transaction
    createFinancialTransactionHandler(
      clientName,
      totalAmount,
      dueDate,
      orderId,
      'order',
      paymentMethod,
      installments
    );
    
    // Create schedule event
    createScheduleEventFromTransaction(
      clientName,
      serviceType,
      eventDate,
      eventTime,
      location,
      orderId,
      'order',
      notes
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
    setSelectedContact(null);
  };

  // Handle new contract creation
  const handleCreateContract = (
    contractId: string, 
    clientName: string, 
    totalAmount: number, 
    dueDate: string,
    paymentMethod: string,
    installments: number,
    // Schedule parameters
    serviceType: string,
    eventDate: string,
    eventTime: string,
    location: string,
    notes?: string
  ) => {
    // Create financial transaction
    createFinancialTransactionHandler(
      clientName,
      totalAmount,
      dueDate,
      contractId,
      'contract',
      paymentMethod,
      installments
    );
    
    // Create schedule event
    createScheduleEventFromTransaction(
      clientName,
      serviceType,
      eventDate,
      eventTime,
      location,
      contractId,
      'contract',
      notes
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
    setSelectedContact(null);
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
      const history = leadData && Array.isArray(leadData.history) 
        ? [...leadData.history, historyEntry] 
        : [historyEntry];
      
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
                  leadData={selectedLead}
                  contactData={selectedContact}
                />
              </TabsContent>
              
              <TabsContent value="contracts" className="bg-card rounded-lg p-4">
                <ContractsTab 
                  leadData={selectedLead}
                  contactData={selectedContact}
                />
              </TabsContent>
              
              <TabsContent value="products" className="bg-card rounded-lg p-4">
                <ProductsTab />
              </TabsContent>
              
              <TabsContent value="financial" className="bg-card rounded-lg p-4">
                <FinancialTab 
                  transactions={transactions}
                  loading={loadingTransactions}
                  onUpdateStatus={handleUpdateTransactionStatus}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersContracts;
