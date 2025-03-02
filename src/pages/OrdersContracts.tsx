
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrdersTab from "@/components/orders-contracts/OrdersTab";
import ContractsTab from "@/components/orders-contracts/ContractsTab";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OrderForm from "@/components/orders-contracts/OrderForm";
import ContractForm from "@/components/orders-contracts/ContractForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the type for the selected lead/contact
interface SelectedEntity {
  id: string;
  name: string;
  type: 'lead' | 'contact';
  amount?: number;
}

const OrdersContracts = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to add financial record when an order or contract is created
  const addFinancialRecord = async (data: {
    client: string;
    amount: number;
    dueDate: string;
    category: string;
    paymentMethod: string;
    totalInstallments?: number;
    type: 'receivable';
    status: 'pending';
    sourceId: string;
    sourceType: 'order' | 'contract';
  }) => {
    try {
      // Generate an insert record into financial_transactions table
      console.log("Adding financial record:", data);
      
      // Create a payment record in Supabase
      const { data: financialRecord, error } = await supabase
        .from('financial_transactions')
        .insert([{
          client: data.client,
          amount: data.amount,
          due_date: data.dueDate,
          category: data.category,
          payment_method: data.paymentMethod,
          total_installments: data.totalInstallments || 1,
          type: 'receivable',
          status: 'pending',
          source_id: data.sourceId,
          source_type: data.sourceType
        }])
        .select();

      if (error) {
        console.error("Error adding financial record:", error);
        toast.error("Erro ao adicionar registro financeiro");
        return null;
      }

      toast.success("Registro financeiro adicionado com sucesso");
      return financialRecord;
    } catch (error) {
      console.error("Error in addFinancialRecord:", error);
      toast.error("Erro ao processar registro financeiro");
      return null;
    }
  };

  // Check sessionStorage for lead/contact information on component mount
  useEffect(() => {
    // Check for order creation request
    const orderFromEntityData = sessionStorage.getItem('createOrderFromLead');
    if (orderFromEntityData) {
      try {
        const entityData = JSON.parse(orderFromEntityData);
        setSelectedEntity({
          id: entityData.leadId || entityData.contactId,
          name: entityData.leadName || entityData.contactName,
          type: entityData.type || 'lead',
          amount: entityData.amount || 0
        });
        setActiveTab("orders"); // Switch to orders tab
        setShowOrderForm(true);
        sessionStorage.removeItem('createOrderFromLead'); // Clean up
        toast.info(`Criando pedido para ${entityData.leadName || entityData.contactName || 'cliente'}`);
      } catch (error) {
        console.error("Error parsing entity data for order:", error);
      }
    }

    // Check for contract creation request
    const contractFromEntityData = sessionStorage.getItem('createContractFromLead');
    if (contractFromEntityData) {
      try {
        const entityData = JSON.parse(contractFromEntityData);
        setSelectedEntity({
          id: entityData.leadId || entityData.contactId,
          name: entityData.leadName || entityData.contactName,
          type: entityData.type || 'lead',
          amount: entityData.amount || 0
        });
        setActiveTab("contracts"); // Switch to contracts tab
        setShowContractForm(true);
        sessionStorage.removeItem('createContractFromLead'); // Clean up
        toast.info(`Criando contrato para ${entityData.leadName || entityData.contactName || 'cliente'}`);
      } catch (error) {
        console.error("Error parsing entity data for contract:", error);
      }
    }
  }, []);

  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
    setSelectedEntity(null);
  };

  const handleCloseContractForm = () => {
    setShowContractForm(false);
    setSelectedEntity(null);
  };

  const handleCreateOrder = () => {
    setShowOrderForm(true);
  };

  const handleCreateContract = () => {
    setShowContractForm(true);
  };

  const handleOrderCreated = async (orderData: any) => {
    // Called when an order is successfully created
    try {
      // Add financial record for the order
      if (orderData && orderData.id) {
        await addFinancialRecord({
          client: orderData.clientName,
          amount: orderData.totalAmount,
          dueDate: orderData.dueDate || new Date().toISOString().split('T')[0],
          category: "Vendas",
          paymentMethod: orderData.paymentMethod || "Dinheiro",
          totalInstallments: orderData.installments || 1,
          type: 'receivable',
          status: 'pending',
          sourceId: orderData.id,
          sourceType: 'order'
        });
      }
      handleCloseOrderForm();
    } catch (error) {
      console.error("Error in handleOrderCreated:", error);
      toast.error("Erro ao processar o pedido");
    }
  };

  const handleContractCreated = async (contractData: any) => {
    // Called when a contract is successfully created
    try {
      // Add financial record for the contract
      if (contractData && contractData.id) {
        await addFinancialRecord({
          client: contractData.clientName,
          amount: contractData.totalAmount,
          dueDate: contractData.dueDate || new Date().toISOString().split('T')[0],
          category: "Contratos",
          paymentMethod: contractData.paymentMethod || "Dinheiro",
          totalInstallments: contractData.installments || 1,
          type: 'receivable',
          status: 'pending',
          sourceId: contractData.id,
          sourceType: 'contract'
        });
      }
      handleCloseContractForm();
    } catch (error) {
      console.error("Error in handleContractCreated:", error);
      toast.error("Erro ao processar o contrato");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Pedidos e Contratos</h1>
            <div className="bg-card rounded-lg p-3 md:p-5">
              <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                  <TabsTrigger value="orders" className="text-sm md:text-base">Pedidos</TabsTrigger>
                  <TabsTrigger value="contracts" className="text-sm md:text-base">Contratos</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <OrdersTab onCreateOrder={handleCreateOrder} />
                </TabsContent>
                <TabsContent value="contracts">
                  <ContractsTab onCreateContract={handleCreateContract} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Order Form Dialog */}
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <OrderForm 
            onClose={handleCloseOrderForm} 
            initialLead={selectedEntity}
            onOrderCreated={handleOrderCreated}
          />
        </DialogContent>
      </Dialog>

      {/* Contract Form Dialog */}
      <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ContractForm 
            onClose={handleCloseContractForm}
            initialLead={selectedEntity}
            onContractCreated={handleContractCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersContracts;
