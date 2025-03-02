
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

const OrdersContracts = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<{ leadId: string, leadName: string } | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check sessionStorage for lead information on component mount
  useEffect(() => {
    // Check for order creation request
    const orderFromLeadData = sessionStorage.getItem('createOrderFromLead');
    if (orderFromLeadData) {
      try {
        const leadData = JSON.parse(orderFromLeadData);
        setSelectedLead(leadData);
        setActiveTab("orders"); // Switch to orders tab
        setShowOrderForm(true);
        sessionStorage.removeItem('createOrderFromLead'); // Clean up
        toast.info(`Criando pedido para ${leadData.leadName || 'lead'}`);
      } catch (error) {
        console.error("Error parsing lead data for order:", error);
      }
    }

    // Check for contract creation request
    const contractFromLeadData = sessionStorage.getItem('createContractFromLead');
    if (contractFromLeadData) {
      try {
        const leadData = JSON.parse(contractFromLeadData);
        setSelectedLead(leadData);
        setActiveTab("contracts"); // Switch to contracts tab
        setShowContractForm(true);
        sessionStorage.removeItem('createContractFromLead'); // Clean up
        toast.info(`Criando contrato para ${leadData.leadName || 'lead'}`);
      } catch (error) {
        console.error("Error parsing lead data for contract:", error);
      }
    }
  }, []);

  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
    setSelectedLead(null);
  };

  const handleCloseContractForm = () => {
    setShowContractForm(false);
    setSelectedLead(null);
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
                  <OrdersTab onCreateOrder={() => setShowOrderForm(true)} />
                </TabsContent>
                <TabsContent value="contracts">
                  <ContractsTab onCreateContract={() => setShowContractForm(true)} />
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
            initialLead={selectedLead}
          />
        </DialogContent>
      </Dialog>

      {/* Contract Form Dialog */}
      <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ContractForm 
            onClose={handleCloseContractForm}
            initialLead={selectedLead}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersContracts;
