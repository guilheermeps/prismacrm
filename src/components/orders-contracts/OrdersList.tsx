
import React, { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  MoreVertical,
  Edit,
  Trash,
  FileSignature,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import OrderForm from "./OrderForm";
import ContractForm from "./ContractForm";

// Mock data para demonstração
const mockOrders = [
  {
    id: 1,
    number: "PED-001",
    client: "João Silva",
    date: "2023-12-15",
    items: [
      { id: 1, name: "Design de Website", quantity: 1, unitPrice: 2500 }
    ],
    status: "completed",
    total: 2500,
    paymentMethod: "credit",
    installments: 2
  },
  {
    id: 2,
    number: "PED-002",
    client: "Maria Oliveira",
    date: "2023-12-20",
    items: [
      { id: 1, name: "Hospedagem (1 ano)", quantity: 1, unitPrice: 400 },
      { id: 2, name: "Manutenção Mensal", quantity: 12, unitPrice: 200 }
    ],
    status: "pending",
    total: 2800,
    paymentMethod: "pix",
    installments: 1
  },
  {
    id: 3,
    number: "PED-003",
    client: "Carlos Santos",
    date: "2024-01-05",
    items: [
      { id: 1, name: "Consultoria", quantity: 5, unitPrice: 300 }
    ],
    status: "in-progress",
    total: 1500,
    paymentMethod: "money",
    installments: 1
  },
  {
    id: 4,
    number: "PED-004",
    client: "Ana Pereira",
    date: "2024-01-10",
    items: [
      { id: 1, name: "Licença de Software", quantity: 2, unitPrice: 800 }
    ],
    status: "canceled",
    total: 1600,
    paymentMethod: "debit",
    installments: 1
  }
];

interface OrdersListProps {
  searchTerm?: string;
  statusFilter?: string;
}

const OrdersList: React.FC<OrdersListProps> = ({ searchTerm = "", statusFilter }) => {
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Filtrar os pedidos com base nos critérios
  const filteredOrders = mockOrders.filter(order => {
    // Filtro de busca
    const matchesSearch = 
      order.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const matchesStatus = 
      !statusFilter || 
      statusFilter === "all" || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para editar um pedido
  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setIsEditOrderOpen(true);
  };

  // Função para criar um contrato a partir de um pedido
  const handleCreateContract = (order: any) => {
    setSelectedOrder(order);
    setIsNewContractOpen(true);
  };

  // Obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Obter texto de status
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído";
      case "pending":
        return "Pendente";
      case "in-progress":
        return "Em Andamento";
      case "canceled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  // Obter texto de método de pagamento
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit":
        return "Cartão de Crédito";
      case "debit":
        return "Cartão de Débito";
      case "pix":
        return "PIX";
      case "money":
        return "Dinheiro";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-4">
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        filteredOrders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{order.number}</h3>
                    <span className="inline-flex items-center gap-1 text-sm font-medium">
                      {getStatusIcon(order.status)}
                      <span className="hidden sm:inline">{getStatusText(order.status)}</span>
                    </span>
                  </div>
                  <p className="text-muted-foreground">Cliente: {order.client}</p>
                  <p className="text-sm text-muted-foreground">
                    Data: {new Date(order.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <p className="font-medium">
                      Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      {getPaymentMethodText(order.paymentMethod)}
                      {order.installments > 1 ? ` (${order.installments}x)` : ""}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.items.map((item: any) => (
                      <span 
                        key={item.id}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex sm:flex-col justify-end items-end gap-2">
                  <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Pedido</DialogTitle>
                      </DialogHeader>
                      <OrderForm 
                        initialOrder={selectedOrder} 
                        onClose={() => setIsEditOrderOpen(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Novo Contrato</DialogTitle>
                      </DialogHeader>
                      <ContractForm 
                        onClose={() => setIsNewContractOpen(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateContract(order)}>
                        <FileSignature className="mr-2 h-4 w-4" />
                        Gerar Contrato
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrdersList;
