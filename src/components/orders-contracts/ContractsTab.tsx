
import React, { useState } from "react";
import { 
  PlusCircle, 
  FileText, 
  Filter, 
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash,
  Search,
  FileSignature
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ContractForm from "@/components/orders-contracts/ContractForm";
import ContractFilter from "@/components/orders-contracts/ContractFilter";
import ContractsList from "@/components/orders-contracts/ContractsList";
import ExportDialog from "@/components/orders-contracts/ExportDialog";

// Mock data para demonstração
const mockContractStats = [
  { title: "Contratos em Elaboração", count: 6, value: 18500, status: "draft" },
  { title: "Aguardando Assinatura", count: 9, value: 27300, status: "pending-signature" },
  { title: "Contratos Assinados", count: 28, value: 42900, status: "signed" },
  { title: "Contratos Cancelados", count: 3, value: 4500, status: "canceled" }
];

const ContractsTab = () => {
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Dashboard de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mockContractStats.map((stat, index) => (
          <DashboardCard 
            key={index}
            title={stat.title}
            delay={`${index * 0.1}s`}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold">
                {stat.count}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(stat.value)}
              </span>
            </div>
          </DashboardCard>
        ))}
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2">
                <FileSignature className="h-4 w-4" />
                Criar Contrato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Contrato</DialogTitle>
              </DialogHeader>
              <ContractForm onClose={() => setIsNewContractOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtrar Contratos</DialogTitle>
              </DialogHeader>
              <ContractFilter onClose={() => setIsFilterOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Printer className="h-4 w-4" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exportar Contratos</DialogTitle>
              </DialogHeader>
              <ExportDialog type="contratos" onClose={() => setIsExportOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Em Elaboração</SelectItem>
              <SelectItem value="pending-signature">Aguardando Assinatura</SelectItem>
              <SelectItem value="signed">Assinado</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de contratos */}
      <ContractsList searchTerm={searchTerm} statusFilter={selectedStatus} />
    </div>
  );
};

export default ContractsTab;
