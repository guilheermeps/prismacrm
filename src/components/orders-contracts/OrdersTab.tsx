import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner";
import { SourceEntity } from '@/lib/types';

// Add these props to the OrdersTab component
interface OrdersTabProps {
  leadData?: SourceEntity;
  contactData?: SourceEntity;
  onCreateOrder: (orderId: string, clientName: string, totalAmount: number, dueDate: string, paymentMethod: string, installments: number, serviceType: string, eventDate: string, eventTime: string, location: string, notes?: string) => void;
}

// Make sure the component accepts these props
const OrdersTab: React.FC<OrdersTabProps> = ({ leadData, contactData, onCreateOrder }) => {
  const [orderId, setOrderId] = useState('');
  const [clientName, setClientName] = useState(contactData?.name || leadData?.name || '');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [installments, setInstallments] = useState<number>(1);
  const [serviceType, setServiceType] = useState('');
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!orderId || !clientName || !totalAmount || !dueDate || !paymentMethod || !installments || !serviceType || !eventDate || !eventTime || !location) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    onCreateOrder(
      orderId,
      clientName,
      totalAmount,
      format(dueDate, 'yyyy-MM-dd'),
      paymentMethod,
      installments,
      serviceType,
      format(eventDate, 'yyyy-MM-dd'),
      eventTime,
      location,
      notes
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Pedido</CardTitle>
        <CardDescription>Preencha os detalhes do pedido abaixo.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">ID do Pedido</Label>
            <Input id="orderId" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Valor Total</Label>
            <Input type="number" id="totalAmount" value={totalAmount.toString()} onChange={(e) => setTotalAmount(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Escolha a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="installments">Parcelas</Label>
            <Input type="number" id="installments" value={installments.toString()} onChange={(e) => setInstallments(Number(e.target.value))} />
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serviceType">Tipo de Serviço</Label>
            <Input id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate">Data do Evento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : <span>Escolha a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventTime">Horário do Evento</Label>
            <Input id="eventTime" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <Button onClick={handleSubmit}>Criar Pedido</Button>
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
