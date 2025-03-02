
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ContractsList from "@/components/orders-contracts/ContractsList";
import ContractFilter from "@/components/orders-contracts/ContractFilter";
import ExportDialog from "@/components/orders-contracts/ExportDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContractFilterProps {
  onClose?: () => void;
}

const Contracts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateNewContract = () => {
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
              <h1 className="text-xl md:text-2xl font-bold">Contratos</h1>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button onClick={handleCreateNewContract} size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Novo Contrato</span>
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
              <ContractFilter onClose={() => {}} />
              <div className="mt-4">
                <ContractsList />
              </div>
            </div>
            
            <ExportDialog 
              type="contratos"
              onClose={() => setIsExportDialogOpen(false)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contracts;
