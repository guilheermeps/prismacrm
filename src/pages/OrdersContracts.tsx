
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrdersTab from "@/components/orders-contracts/OrdersTab";
import ContractsTab from "@/components/orders-contracts/ContractsTab";

const OrdersContracts = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
              <Tabs defaultValue="orders" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
                  <TabsTrigger value="orders" className="text-sm md:text-base">Pedidos</TabsTrigger>
                  <TabsTrigger value="contracts" className="text-sm md:text-base">Contratos</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <OrdersTab />
                </TabsContent>
                <TabsContent value="contracts">
                  <ContractsTab />
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
