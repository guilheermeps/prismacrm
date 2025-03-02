import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContractsTabProps {
  leadData?: SourceEntity;
  contactData?: SourceEntity;
  onCreateContract: (contractId: string, clientName: string, totalAmount: number, dueDate: string, paymentMethod: string, installments: number, serviceType: string, eventDate: string, eventTime: string, location: string, notes?: string) => void;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ leadData, contactData, onCreateContract }) => {
  const [contractDetails, setContractDetails] = useState({
    contractId: uuidv4(),
    clientName: contactData?.name || leadData?.name || "",
    totalAmount: 0,
    dueDate: new Date(),
    paymentMethod: "",
    installments: 1,
    serviceType: "",
    eventDate: new Date(),
    eventTime: "09:00",
    location: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContractDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setContractDetails(prevState => ({
        ...prevState,
        dueDate: date,
      }));
    }
  };

  const handleEventDateChange = (date: Date | undefined) => {
    if (date) {
      setContractDetails(prevState => ({
        ...prevState,
        eventDate: date,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { contractId, clientName, totalAmount, dueDate, paymentMethod, installments, serviceType, eventDate, eventTime, location, notes } = contractDetails;

    if (!clientName || !totalAmount || !dueDate || !paymentMethod || !serviceType || !eventDate || !eventTime || !location) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    onCreateContract(
      contractId,
      clientName,
      Number(totalAmount),
      format(dueDate, 'yyyy-MM-dd'),
      paymentMethod,
      Number(installments),
      serviceType,
      format(eventDate, 'yyyy-MM-dd'),
      eventTime,
      location,
      notes
    );

    toast.success("Contrato criado com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Contrato</CardTitle>
        <CardDescription>
          Preencha os detalhes do contrato abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              name="clientName"
              value={contractDetails.clientName}
              onChange={handleInputChange}
              placeholder="Nome do cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Valor Total</Label>
            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              value={contractDetails.totalAmount}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !contractDetails.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {contractDetails.dueDate ? (
                    format(contractDetails.dueDate, "PPP")
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={contractDetails.dueDate}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select onValueChange={(value) => setContractDetails(prevState => ({ ...prevState, paymentMethod: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="boleto">Boleto Bancário</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="installments">Parcelas</Label>
            <Input
              id="installments"
              name="installments"
              type="number"
              value={contractDetails.installments}
              onChange={handleInputChange}
              placeholder="Número de parcelas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Tipo de Serviço</Label>
            <Input
              id="serviceType"
              name="serviceType"
              type="text"
              value={contractDetails.serviceType}
              onChange={handleInputChange}
              placeholder="Tipo de serviço"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data do Evento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !contractDetails.eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {contractDetails.eventDate ? (
                    format(contractDetails.eventDate, "PPP")
                  ) : (
                    <span>Escolha uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={contractDetails.eventDate}
                  onSelect={handleEventDateChange}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventTime">Horário do Evento</Label>
            <Input
              type="time"
              id="eventTime"
              name="eventTime"
              value={contractDetails.eventTime}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Local do Evento</Label>
          <Input
            id="location"
            name="location"
            type="text"
            value={contractDetails.location}
            onChange={handleInputChange}
            placeholder="Local do evento"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            value={contractDetails.notes}
            onChange={handleInputChange}
            placeholder="Observações adicionais"
          />
        </div>

        <Button onClick={handleSubmit}>Criar Contrato</Button>
      </CardContent>
    </Card>
  );
};

export default ContractsTab;
