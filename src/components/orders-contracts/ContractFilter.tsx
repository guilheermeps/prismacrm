
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock data para templates e clientes
const mockTemplates = [
  { id: 1, name: "Contrato de Prestação de Serviços" },
  { id: 2, name: "Contrato de Desenvolvimento de Software" },
  { id: 3, name: "Acordo de Confidencialidade" },
  { id: 4, name: "Contrato de Venda de Produtos" }
];

const mockClients = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Oliveira" },
  { id: 3, name: "Carlos Santos" },
  { id: 4, name: "Ana Pereira" }
];

interface ContractFilterProps {
  onClose: () => void;
}

const ContractFilter: React.FC<ContractFilterProps> = ({ onClose }) => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [expiryDateFrom, setExpiryDateFrom] = useState<Date | undefined>(undefined);
  const [expiryDateTo, setExpiryDateTo] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [template, setTemplate] = useState<string | undefined>(undefined);
  const [client, setClient] = useState<string | undefined>(undefined);
  const [hasAttachments, setHasAttachments] = useState<string | undefined>(undefined);

  // Função para aplicar os filtros
  const handleApplyFilters = () => {
    const filters = {
      dateFrom,
      dateTo,
      expiryDateFrom,
      expiryDateTo,
      status,
      template,
      client,
      hasAttachments
    };
    
    console.log("Applied filters:", filters);
    onClose();
  };

  // Função para limpar todos os filtros
  const handleClearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setExpiryDateFrom(undefined);
    setExpiryDateTo(undefined);
    setStatus(undefined);
    setTemplate(undefined);
    setClient(undefined);
    setHasAttachments(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Data de Criação */}
        <div className="space-y-2">
          <Label>Data de Criação (Inicial)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>Data de Criação (Final)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd/MM/yyyy") : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Data de Expiração */}
        <div className="space-y-2">
          <Label>Data de Expiração (Inicial)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDateFrom ? format(expiryDateFrom, "dd/MM/yyyy") : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiryDateFrom}
                onSelect={setExpiryDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>Data de Expiração (Final)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDateTo ? format(expiryDateTo, "dd/MM/yyyy") : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiryDateTo}
                onSelect={setExpiryDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
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
        
        {/* Modelo de Contrato */}
        <div className="space-y-2">
          <Label>Modelo de Contrato</Label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os modelos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {mockTemplates.map(template => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Cliente */}
        <div className="space-y-2">
          <Label>Cliente</Label>
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {mockClients.map(client => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Contém Anexos */}
        <div className="space-y-2">
          <Label>Anexos</Label>
          <Select value={hasAttachments} onValueChange={setHasAttachments}>
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer</SelectItem>
              <SelectItem value="yes">Com Anexos</SelectItem>
              <SelectItem value="no">Sem Anexos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleClearFilters}>
          Limpar Filtros
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractFilter;
