
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrdersTab from "@/components/orders-contracts/OrdersTab";
import ContractsTab from "@/components/orders-contracts/ContractsTab";
import ProductsTab from "@/components/orders-contracts/ProductsTab";

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
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Pedidos e Contratos</h1>
            <Tabs defaultValue="orders" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="orders">Pedidos</TabsTrigger>
                <TabsTrigger value="contracts">Contratos</TabsTrigger>
                <TabsTrigger value="products">Produtos</TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                <OrdersTab />
              </TabsContent>
              <TabsContent value="contracts">
                <ContractsTab />
              </TabsContent>
              <TabsContent value="products">
                <ProductsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersContracts;
