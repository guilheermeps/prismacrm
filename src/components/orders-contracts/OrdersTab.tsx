
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
  Search
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DashboardCard from "@/components/dashboard/DashboardCard";
import OrderForm from "@/components/orders-contracts/OrderForm";
import OrderFilter from "@/components/orders-contracts/OrderFilter";
import OrdersList from "@/components/orders-contracts/OrdersList";
import ExportDialog from "@/components/orders-contracts/ExportDialog";

// Mock data para demonstração
const mockOrderStats = [
  { title: "Pedidos Ativos", count: 15, value: 12500, status: "active" },
  { title: "Pedidos Pendentes", count: 8, value: 5700, status: "pending" },
  { title: "Pedidos Concluídos", count: 32, value: 28900, status: "completed" },
  { title: "Pedidos Cancelados", count: 4, value: 3200, status: "canceled" }
];

const OrdersTab = () => {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Dashboard de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mockOrderStats.map((stat, index) => (
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
          <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2">
                <PlusCircle className="h-4 w-4" />
                Criar Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Pedido</DialogTitle>
              </DialogHeader>
              <OrderForm onClose={() => setIsNewOrderOpen(false)} />
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
                <DialogTitle>Filtrar Pedidos</DialogTitle>
              </DialogHeader>
              <OrderFilter onClose={() => setIsFilterOpen(false)} />
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
                <DialogTitle>Exportar Pedidos</DialogTitle>
              </DialogHeader>
              <ExportDialog type="pedidos" onClose={() => setIsExportOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedidos..."
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
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de pedidos */}
      <OrdersList searchTerm={searchTerm} statusFilter={selectedStatus} />
    </div>
  );
};

export default OrdersTab;
