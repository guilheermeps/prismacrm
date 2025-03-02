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
import { SourceEntity } from "@/lib/types";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

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
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [installments, setInstallments] = useState<number>(1);
  const [serviceType, setServiceType] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState<number>(1);
  const [newItemPrice, setNewItemPrice] = useState<number>(0);

  const handleDateChange = (date: Date | undefined) => {
    setDueDate(date);
    setIsCalendarOpen(false);
  };

  const handleAddItem = () => {
    if (newItemName && newItemQuantity > 0 && newItemPrice >= 0) {
      const newItem: OrderItem = {
        id: uuidv4(),
        name: newItemName,
        quantity: newItemQuantity,
        price: newItemPrice,
      };
      setOrderItems([...orderItems, newItem]);
      setNewItemName('');
      setNewItemQuantity(1);
      setNewItemPrice(0);
    } else {
      toast.error("Por favor, preencha todos os campos do item.");
    }
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (!clientName || !dueDate || !paymentMethod || !serviceType || !eventDate || !eventTime || !location) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formattedDueDate = format(dueDate, 'yyyy-MM-dd');
    const formattedEventDate = format(eventDate, 'yyyy-MM-dd');

    if (onCreateOrder) {
      onCreateOrder(orderId, clientName, totalAmount, formattedDueDate, paymentMethod, installments, serviceType, formattedEventDate, eventTime, location, notes);

      // Create order in supabase
      const orderData = {
        client_name: clientName,
        total_amount: totalAmount,
        due_date: formattedDueDate,
        payment_method: paymentMethod,
        installments: installments,
        items: orderItems,
        notes: notes,
        client_id: leadData?.id || contactData?.id || null,
        source_id: leadData?.id || contactData?.id || null,
        source_type: leadData?.type || contactData?.type || null,
        status: 'pending'
      };

      try {
        await createOrder(orderData);
        toast.success("Pedido criado com sucesso!");
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error("Erro ao criar pedido. Tente novamente.");
      }
    } else {
      console.log("Order data:", { orderId, clientName, totalAmount, dueDate, paymentMethod, installments, serviceType, eventDate, eventTime, location, notes });
      toast.success("Pedido criado com sucesso!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Pedido</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="totalAmount">Valor Total</Label>
            <Input
              id="totalAmount"
              type="number"
              value={totalAmount.toString()}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={
                    format(dueDate || new Date(), 'PPP', { locale: ptBR })
                      ? "justify-start text-left font-normal"
                      : "text-muted-foreground"
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP', { locale: ptBR }) : <span>Escolher Data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={dueDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="boleto">Boleto Bancário</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="transfer">Transferência Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="installments">Parcelas</Label>
            <Input
              id="installments"
              type="number"
              value={installments.toString()}
              onChange={(e) => setInstallments(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="serviceType">Tipo de Serviço</Label>
            <Select onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casamento">Casamento</SelectItem>
                <SelectItem value="aniversario">Aniversário</SelectItem>
                <SelectItem value="corporativo">Corporativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventDate">Data do Evento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={
                    format(eventDate || new Date(), 'PPP', { locale: ptBR })
                      ? "justify-start text-left font-normal"
                      : "text-muted-foreground"
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, 'PPP', { locale: ptBR }) : <span>Escolher Data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={eventDate}
                  onSelect={(date) => setEventDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="eventTime">Horário do Evento</Label>
            <Input
              id="eventTime"
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Localização</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <Label htmlFor="newItemName">Item</Label>
                  <Input
                    type="text"
                    id="newItemName"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newItemQuantity">Quantidade</Label>
                  <Input
                    type="number"
                    id="newItemQuantity"
                    value={newItemQuantity.toString()}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="newItemPrice">Preço</Label>
                  <Input
                    type="number"
                    id="newItemPrice"
                    value={newItemPrice.toString()}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={handleAddItem}><Plus className="mr-2 h-4 w-4" /> Adicionar Item</Button>
              <ul className="mt-4">
                {orderItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center py-2 border-b">
                    <span>{item.name} - {item.quantity} x R$ {item.price.toFixed(2)}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                Total: R$ {calculateTotal().toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>Criar Pedido</Button>
      </CardFooter>
    </Card>
  );
};

export default OrdersTab;
