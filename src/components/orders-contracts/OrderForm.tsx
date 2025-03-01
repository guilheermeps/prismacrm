
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockContacts } from "@/utils/mockData";

// Mock data para produtos/serviços
const mockProducts = [
  { id: 1, name: "Design de Website", type: "service", price: 2500 },
  { id: 2, name: "Hospedagem (1 ano)", type: "service", price: 400 },
  { id: 3, name: "Licença de Software", type: "product", price: 800 },
  { id: 4, name: "Consultoria", type: "service", price: 1200 }
];

const mockPaymentMethods = [
  { id: "money", name: "Dinheiro" },
  { id: "debit", name: "Cartão de Débito" },
  { id: "credit", name: "Cartão de Crédito" },
  { id: "pix", name: "PIX" }
];

const mockServiceTypes = [
  { id: "wedding", name: "Casamento" },
  { id: "event", name: "Evento" },
  { id: "portrait", name: "Ensaio" },
  { id: "graduation", name: "Formatura" },
  { id: "birthday", name: "Aniversário" },
  { id: "corporate", name: "Corporativo" }
];

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const OrderForm = ({ 
  onClose,
  initialOrder = null 
}: { 
  onClose: () => void;
  initialOrder?: any | null;
}) => {
  const [clientId, setClientId] = useState(initialOrder?.clientId || "");
  const [orderDate, setOrderDate] = useState<Date | undefined>(
    initialOrder?.orderDate ? new Date(initialOrder.orderDate) : new Date()
  );
  
  // Novos campos para trabalhos fotográficos
  const [serviceDate, setServiceDate] = useState<Date | undefined>(
    initialOrder?.serviceDate ? new Date(initialOrder.serviceDate) : undefined
  );
  const [startTime, setStartTime] = useState(initialOrder?.startTime || "");
  const [duration, setDuration] = useState(initialOrder?.duration || "");
  const [location, setLocation] = useState(initialOrder?.location || "");
  const [serviceType, setServiceType] = useState(initialOrder?.serviceType || "");
  
  const [status, setStatus] = useState(initialOrder?.status || "pending");
  const [paymentMethod, setPaymentMethod] = useState(initialOrder?.paymentMethod || "");
  const [items, setItems] = useState<OrderItem[]>(initialOrder?.items || []);
  const [installments, setInstallments] = useState(initialOrder?.installments || 1);
  const [installmentDates, setInstallmentDates] = useState<Date[]>(
    initialOrder?.installmentDates || [new Date()]
  );
  const [cardFeeType, setCardFeeType] = useState(initialOrder?.cardFeeType || "percentage");
  const [cardFeeValue, setCardFeeValue] = useState(initialOrder?.cardFeeValue || 0);
  const [notes, setNotes] = useState(initialOrder?.notes || "");

  // Add a new empty item
  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now(),
      productId: 0,
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    setItems([...items, newItem]);
  };

  // Remove an item
  const removeItem = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Update item details
  const updateItem = (itemId: number, field: string, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // If product ID changed, update unit price
        if (field === 'productId') {
          const product = mockProducts.find(p => p.id === value);
          updatedItem.unitPrice = product?.price || 0;
        }
        
        // Recalculate total price if quantity or unit price changed
        if (field === 'productId' || field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
  };

  // Calculate order total
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  // Calculate fee amount
  const calculateFee = () => {
    const total = calculateTotal();
    if (paymentMethod === "credit") {
      if (cardFeeType === "percentage") {
        return total * (cardFeeValue / 100);
      } else {
        return cardFeeValue;
      }
    }
    return 0;
  };

  // Update installment dates when installments change
  const updateInstallmentDates = (newInstallments: number) => {
    const dates = [];
    const baseDate = orderDate || new Date();
    
    for (let i = 0; i < newInstallments; i++) {
      const newDate = new Date(baseDate);
      newDate.setMonth(newDate.getMonth() + i);
      dates.push(newDate);
    }
    
    setInstallmentDates(dates);
  };

  // Handle save
  const handleSave = () => {
    const orderData = {
      clientId,
      orderDate,
      status,
      paymentMethod,
      items,
      installments,
      installmentDates,
      cardFeeType,
      cardFeeValue,
      notes,
      // Novos campos
      serviceDate,
      startTime,
      duration,
      location,
      serviceType,
      total: calculateTotal(),
      feeAmount: calculateFee()
    };
    
    console.log("Order saved:", orderData);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente e Informações Básicas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockContacts
                  .filter(contact => contact.type === "client")
                  .map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data do Pedido</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {orderDate ? format(orderDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={orderDate}
                  onSelect={setOrderDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status do pedido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Novo campo: Tipo de serviço */}
          <div className="space-y-2">
            <Label htmlFor="serviceType">Tipo de Serviço</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                {mockServiceTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pagamento */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {mockPaymentMethods.map(method => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "credit" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="installments">Parcelas</Label>
                <Select 
                  value={installments.toString()} 
                  onValueChange={(value) => {
                    const newInstallments = parseInt(value);
                    setInstallments(newInstallments);
                    updateInstallmentDates(newInstallments);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Número de parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Taxa de Cartão</Label>
                <div className="flex gap-2">
                  <Select value={cardFeeType} onValueChange={setCardFeeType}>
                    <SelectTrigger className="w-1/3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">R$</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={cardFeeValue}
                    onChange={(e) => setCardFeeValue(parseFloat(e.target.value) || 0)}
                    className="w-2/3"
                    placeholder={cardFeeType === "percentage" ? "Percentual" : "Valor fixo"}
                  />
                </div>
              </div>

              {installments > 1 && (
                <div className="space-y-2">
                  <Label>Datas de Pagamento</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {installmentDates.map((date, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-12">{index + 1}ª</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(date, "dd/MM/yyyy")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(newDate) => {
                                if (newDate) {
                                  const newDates = [...installmentDates];
                                  newDates[index] = newDate;
                                  setInstallmentDates(newDates);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Novos campos: Detalhes do Trabalho */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Trabalho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data do Trabalho</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {serviceDate ? format(serviceDate, "dd/MM/yyyy") : "Selecione a data do trabalho"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={serviceDate}
                    onSelect={setServiceDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Horário de Início</Label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (horas)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 3.5"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Local do Trabalho</Label>
              <Textarea
                id="location"
                rows={2}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Endereço completo do local onde será realizado o trabalho"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum item adicionado ao pedido
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Select
                        value={item.productId.toString()}
                        onValueChange={(value) => updateItem(item.id, 'productId', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar produto/serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map(product => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        placeholder="Qtd"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="Valor Unit."
                      />
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(item.totalPrice)}
                    </div>
                    <div className="col-span-1 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Button variant="outline" className="w-full" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="space-y-1">
            <div className="font-medium">
              Subtotal: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
            </div>
            {paymentMethod === "credit" && (
              <div className="text-sm text-muted-foreground">
                Taxa: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateFee())}
              </div>
            )}
          </div>
          <div className="text-xl font-bold">
            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal() + calculateFee())}
          </div>
        </CardFooter>
      </Card>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full"
          placeholder="Observações sobre o pedido..."
        />
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar Pedido
        </Button>
      </div>
    </div>
  );
};

export default OrderForm;
