import React, { useState, useEffect } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { Lead } from '@/lib/supabase/types';
import { getLeadById } from '@/lib/supabase/services/leadsCrudService';
import OrdersTab from '@/components/orders-contracts/OrdersTab';
import ContractsTab from '@/components/orders-contracts/ContractsTab';

interface SourceEntity {
  lead?: Lead;
  contact?: any;
}

const OrdersContracts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [sourceEntityData, setSourceEntityData] = useState<SourceEntity>({});
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Function to extract data from sessionStorage
    const extractSessionStorageData = () => {
      let leadData: Lead | null = null;
      let contactData: any = null;

      // Check for lead data
      const leadDataStr = sessionStorage.getItem('createOrderFromLead') || sessionStorage.getItem('createContractFromLead');
      if (leadDataStr) {
        try {
          leadData = JSON.parse(leadDataStr);
          sessionStorage.removeItem('createOrderFromLead');
          sessionStorage.removeItem('createContractFromLead');
        } catch (error) {
          console.error("Error parsing lead data from sessionStorage:", error);
        }
      }

      // Check for contact data
      const contactDataStr = sessionStorage.getItem('createOrderFromContact') || sessionStorage.getItem('createContractFromContact');
      if (contactDataStr) {
        try {
          contactData = JSON.parse(contactDataStr);
          sessionStorage.removeItem('createOrderFromContact');
          sessionStorage.removeItem('createContractFromContact');
        } catch (error) {
          console.error("Error parsing contact data from sessionStorage:", error);
        }
      }

      return { lead: leadData, contact: contactData };
    };

    const fetchData = async () => {
      const sessionStorageData = extractSessionStorageData();
      if (sessionStorageData.lead && sessionStorageData.lead.leadId) {
        try {
          const lead = await getLeadById(sessionStorageData.lead.leadId);
          setSourceEntityData({ ...sourceEntityData, lead: lead || undefined });
        } catch (error) {
          console.error("Error fetching lead data:", error);
        }
      }
      setSourceEntityData({
        lead: sessionStorageData.lead,
        contact: sessionStorageData.contact,
      });
    };

    fetchData();
  }, []);

  const handleCreateOrder = (orderId: string, clientName: string, totalAmount: number, dueDate: string, paymentMethod: string, installments: number, serviceType: string, eventDate: string, eventTime: string, location: string, notes?: string) => {
    // Logic to handle order creation
    console.log("Order created:", { orderId, clientName, totalAmount, dueDate, paymentMethod, installments, serviceType, eventDate, eventTime, location, notes });
    navigate('/orders');
  };

  const handleCreateContract = (contractId: string, clientName: string, totalAmount: number, dueDate: string, paymentMethod: string, installments: number, serviceType: string, eventDate: string, eventTime: string, location: string, notes?: string) => {
    // Logic to handle contract creation
    console.log("Contract created:", { contractId, clientName, totalAmount, dueDate, paymentMethod, installments, serviceType, eventDate, eventTime, location, notes });
    navigate('/contracts');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Pedidos e Contratos</h1>
            <div className="bg-card rounded-lg p-3 md:p-5">
              <Tabs defaultValue="orders" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                  <TabsTrigger value="orders" className="text-xs md:text-base">Pedidos</TabsTrigger>
                  <TabsTrigger value="contracts" className="text-xs md:text-base">Contratos</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <OrdersTab
                    leadData={sourceEntityData.lead}
                    contactData={sourceEntityData.contact}
                    onCreateOrder={handleCreateOrder}
                  />
                </TabsContent>
                <TabsContent value="contracts">
                  <ContractsTab
                    leadData={sourceEntityData.lead}
                    contactData={sourceEntityData.contact}
                    onCreateContract={handleCreateContract}
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

export default OrdersContracts;
