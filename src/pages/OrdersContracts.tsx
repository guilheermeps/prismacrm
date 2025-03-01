
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrdersTab from "@/components/orders-contracts/OrdersTab";
import ContractsTab from "@/components/orders-contracts/ContractsTab";

const OrdersContracts = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Pedidos e Contratos" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="orders" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="orders">Pedidos</TabsTrigger>
                <TabsTrigger value="contracts">Contratos</TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                <OrdersTab />
              </TabsContent>
              <TabsContent value="contracts">
                <ContractsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersContracts;
