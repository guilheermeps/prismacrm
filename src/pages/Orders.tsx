
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import OrdersList from "@/components/orders-contracts/OrdersList";
import OrderFilter from "@/components/orders-contracts/OrderFilter";
import ExportDialog from "@/components/orders-contracts/ExportDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

interface OrderFilterProps {
  onClose?: () => void;
}

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateNewOrder = () => {
    navigate('/orders-contracts');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-bold">Pedidos</h1>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button onClick={handleCreateNewOrder} size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Novo Pedido</span>
                </Button>
                <Button 
                  onClick={() => setIsExportDialogOpen(true)} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Exportar</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-3 md:p-5">
              <OrderFilter onClose={() => {}} />
              <div className="mt-4">
                <OrdersList />
              </div>
            </div>
            
            <ExportDialog 
              open={isExportDialogOpen} 
              onOpenChange={setIsExportDialogOpen}
              title="Exportar Pedidos"
              description="Selecione o formato e os filtros para exportar os pedidos."
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
