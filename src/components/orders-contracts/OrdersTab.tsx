
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createOrder } from "@/lib/supabase/ordersService";
import { OrderItem, SourceEntity } from "@/lib/types";

interface OrdersTabProps {
  leadData?: SourceEntity;
  contactData?: SourceEntity;
  onCreateOrder?: (orderId: string, clientName: string, totalAmount: number, dueDate: string, paymentMethod: string, installments: number, serviceType: string, eventDate: string, eventTime: string, location: string, notes?: string) => void;
}

const OrdersTab = ({ leadData, contactData, onCreateOrder }: OrdersTabProps) => {
  const [orderId, setOrderId] = useState(uuidv4());
  const [clientName, setClientName] = useState(leadData?.name || contactData?.name || '');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [installments, setInstallments] = useState<number>(1);
  const [serviceType, setServiceType] = useState<string>('photography');
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState<string>('10:00');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<OrderItem[]>([{ id: uuidv4(), name: '', quantity: 1, price: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    if (!clientName || !dueDate || !paymentMethod || !serviceType || !eventDate || !eventTime || !location) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (totalAmount <= 0) {
      toast.error('O valor total deve ser maior que zero.');
      return;
    }

    const formattedDueDate = format(dueDate, 'yyyy-MM-dd');
    const formattedEventDate = format(eventDate, 'yyyy-MM-dd');

    try {
      const orderData = {
        client_name: clientName,
        total_amount: totalAmount,
        due_date: formattedDueDate,
        payment_method: paymentMethod,
        payment_status: 'pending' as 'pending' | 'completed',
        installments: installments,
        items: items,
        notes: notes,
        client_id: leadData?.id || contactData?.id,
        source_id: leadData?.id || contactData?.id,
        source_type: leadData ? 'lead' as 'lead' | 'contact' : 'contact' as 'lead' | 'contact',
        status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'canceled'
      };

      const created = await createOrder(orderData);

      if (created) {
        toast.success('Pedido criado com sucesso!');
        if (onCreateOrder) {
          onCreateOrder(orderId, clientName, totalAmount, formattedDueDate, paymentMethod, installments, serviceType, formattedEventDate, eventTime, location, notes);
        }
      } else {
        toast.error('Erro ao criar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Pedido</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="clientName">Nome do Cliente</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="totalAmount">Valor Total</Label>
          <Input
            id="totalAmount"
            type="number"
            value={totalAmount.toString()}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            placeholder="Valor total"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Data de Vencimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={format(dueDate || new Date(), 'PPP', { locale: ptBR }) + " w-[240px] justify-start text-left font-normal"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                locale={ptBR}
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
        <div className="grid gap-2">
          <Label htmlFor="paymentMethod">Método de Pagamento</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="installments">Parcelas</Label>
          <Input
            id="installments"
            type="number"
            value={installments.toString()}
            onChange={(e) => setInstallments(Number(e.target.value))}
            placeholder="Número de parcelas"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="serviceType">Tipo de Serviço</Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photography">Fotografia</SelectItem>
              <SelectItem value="videography">Videografia</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eventDate">Data do Evento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={format(eventDate || new Date(), 'PPP', { locale: ptBR }) + " w-[240px] justify-start text-left font-normal"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDate ? format(eventDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={eventDate}
                onSelect={setEventDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="eventTime">Horário do Evento</Label>
          <Input
            id="eventTime"
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            placeholder="Horário do evento"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Local do evento"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações"
          />
        </div>

        <div>
          <Label>Itens:</Label>
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 mb-2">
              <div className="grid gap-2 flex-1">
                <Label htmlFor={`itemName-${index}`}>Nome do Item</Label>
                <Input
                  id={`itemName-${index}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Nome do item"
                />
              </div>
              <div className="grid gap-2 flex-1">
                <Label htmlFor={`itemQuantity-${index}`}>Quantidade</Label>
                <Input
                  id={`itemQuantity-${index}`}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  placeholder="Quantidade"
                />
              </div>
              <div className="grid gap-2 flex-1">
                <Label htmlFor={`itemPrice-${index}`}>Preço</Label>
                <Input
                  id={`itemPrice-${index}`}
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                  placeholder="Preço"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>Criar Pedido</Button>
      </CardFooter>
    </Card>
  );
};

export default OrdersTab;
