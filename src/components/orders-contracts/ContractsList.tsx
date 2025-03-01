
import React, { useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  MoreVertical,
  Edit,
  Trash,
  Download,
  Send,
  Copy,
  File
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
import ContractForm from "./ContractForm";

// Mock data para demonstração
const mockContracts = [
  {
    id: 1,
    number: "CONT-001",
    client: "João Silva",
    title: "Desenvolvimento de Website",
    date: "2023-12-18",
    expirationDate: "2024-12-18",
    status: "signed",
    orderId: 1,
    attachments: [
      { id: 1, name: "contrato-assinado.pdf", type: "application/pdf", size: 1540000 }
    ]
  },
  {
    id: 2,
    number: "CONT-002",
    client: "Maria Oliveira",
    title: "Hospedagem e Manutenção",
    date: "2023-12-25",
    expirationDate: "2024-12-25",
    status: "pending-signature",
    orderId: 2,
    attachments: []
  },
  {
    id: 3,
    number: "CONT-003",
    client: "Carlos Santos",
    title: "Consultoria Estratégica",
    date: "2024-01-10",
    expirationDate: "2024-06-10",
    status: "draft",
    orderId: 3,
    attachments: [
      { id: 1, name: "proposta-tecnica.pdf", type: "application/pdf", size: 850000 },
      { id: 2, name: "cronograma.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 350000 }
    ]
  },
  {
    id: 4,
    number: "CONT-004",
    client: "Ana Pereira",
    title: "Licenciamento de Software",
    date: "2024-01-15",
    expirationDate: "2025-01-15",
    status: "canceled",
    orderId: 4,
    attachments: [
      { id: 1, name: "contrato-preliminar.pdf", type: "application/pdf", size: 1200000 }
    ]
  }
];

interface ContractsListProps {
  searchTerm?: string;
  statusFilter?: string;
}

const ContractsList: React.FC<ContractsListProps> = ({ searchTerm = "", statusFilter }) => {
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);

  // Filtrar os contratos com base nos critérios
  const filteredContracts = mockContracts.filter(contract => {
    // Filtro de busca
    const matchesSearch = 
      contract.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const matchesStatus = 
      !statusFilter || 
      statusFilter === "all" || 
      contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para editar um contrato
  const handleEditContract = (contract: any) => {
    setSelectedContract(contract);
    setIsEditContractOpen(true);
  };

  // Obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending-signature":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "draft":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Obter texto de status
  const getStatusText = (status: string) => {
    switch (status) {
      case "signed":
        return "Assinado";
      case "pending-signature":
        return "Aguardando Assinatura";
      case "draft":
        return "Em Elaboração";
      case "canceled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="space-y-4">
      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Nenhum contrato encontrado</p>
          </CardContent>
        </Card>
      ) : (
        filteredContracts.map(contract => (
          <Card key={contract.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{contract.number}</h3>
                    <span className="inline-flex items-center gap-1 text-sm font-medium">
                      {getStatusIcon(contract.status)}
                      <span className="hidden sm:inline">{getStatusText(contract.status)}</span>
                    </span>
                  </div>
                  <h4 className="font-medium">{contract.title}</h4>
                  <p className="text-muted-foreground">Cliente: {contract.client}</p>
                  <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                    <p>Data: {new Date(contract.date).toLocaleDateString('pt-BR')}</p>
                    <p>Validade: {new Date(contract.expirationDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="space-y-2 flex-shrink-0">
                  {contract.attachments.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Anexos:</p>
                      <div className="flex flex-col gap-1">
                        {contract.attachments.map((attachment: any) => (
                          <div 
                            key={attachment.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex sm:flex-col justify-end items-end gap-2">
                  <Dialog open={isEditContractOpen} onOpenChange={setIsEditContractOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Contrato</DialogTitle>
                      </DialogHeader>
                      <ContractForm 
                        initialContract={selectedContract} 
                        onClose={() => setIsEditContractOpen(false)} 
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
                      <DropdownMenuItem onClick={() => handleEditContract(contract)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar para Assinatura
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

export default ContractsList;
