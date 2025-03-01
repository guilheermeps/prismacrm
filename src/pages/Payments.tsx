
import { useState, useEffect, useRef } from 'react';
import { Check, CreditCard, Calendar, DollarSign, Filter, Plus, Search, Trash2, Edit2, Download, WalletCards, FileText, Percent, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { upcomingPayments } from '@/utils/mockData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import NegotiationCard from '@/components/dashboard/NegotiationCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Definir o tipo de pagamento
type PaymentType = 'receivable' | 'payable';
type PaymentStatus = 'pending' | 'completed';
type PaymentMethod = 'Dinheiro' | 'Cartão de Débito' | 'Cartão de Crédito' | 'PIX' | string;
type FeeType = 'percentage' | 'fixed';

// Definir interface de parcela
interface Installment {
  number: number;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
}

// Extended payment interface
interface Payment {
  id: number;
  client: string;
  service: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  type: PaymentType;
  category?: string;
  paymentMethod?: PaymentMethod;
  installments?: Installment[];
  feeAmount?: number;
  feeType?: FeeType;
  feePercentage?: number;
  totalInstallments?: number;
}

// Extended category interface
interface Category {
  id: number;
  name: string;
  type: PaymentType;
}

// Interface para meses
interface MonthFilterOption {
  value: string;
  label: string;
}

const Payments = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [payments, setPayments] = useState<Payment[]>(upcomingPayments as Payment[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isPaymentMethodDialogOpen, setIsPaymentMethodDialogOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<string>('');
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [exportMonth, setExportMonth] = useState<string>('all');
  const [exportType, setExportType] = useState<string>('all');
  const [exportCategory, setExportCategory] = useState<string>('all');
  
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    type: 'receivable'
  });
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Casamento', type: 'receivable' },
    { id: 2, name: 'Formatura', type: 'receivable' },
    { id: 3, name: 'Gestante', type: 'receivable' },
    { id: 4, name: '15 anos', type: 'receivable' },
    { id: 5, name: 'Despesa Fixa', type: 'payable' },
    { id: 6, name: 'Material', type: 'payable' },
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    'Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX'
  ]);
  
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    client: '',
    service: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    type: 'receivable',
    category: '',
    paymentMethod: 'Dinheiro',
    totalInstallments: 1,
    feeType: 'percentage',
    feePercentage: 0,
    feeAmount: 0
  });
  
  const [installments, setInstallments] = useState<Installment[]>([]);
  const installmentDates = useRef<string[]>([]);
  
  const [clients, setClients] = useState<string[]>([
    'Ana Carolina', 'Marcos Silva', 'Juliana Santos', 'Pedro Oliveira', 
    'Carla Mendes', 'Aluguel Estúdio', 'Fornecedor Álbuns', 'Energia Elétrica'
  ]);
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  
  // Opções para filtro de mês
  const monthOptions: MonthFilterOption[] = [
    { value: 'all', label: 'Todos os meses' },
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];
  
  // Initialize payments with categories from existing data
  useEffect(() => {
    const updatedPayments = upcomingPayments.map(payment => ({
      ...payment,
      category: payment.service,
      paymentMethod: 'Dinheiro',
      installments: [],
      totalInstallments: 1,
    }));
    setPayments(updatedPayments as Payment[]);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleCompletePayment = (id: number) => {
    setPayments(
      payments.map(payment => 
        payment.id === id ? { ...payment, status: payment.status === 'completed' ? 'pending' : 'completed' } : payment
      )
    );
    
    const payment = payments.find(p => p.id === id);
    
    if (payment) {
      toast({
        title: payment.status === 'completed' ? "Pagamento desmarcado" : "Pagamento confirmado",
        description: payment.status === 'completed' 
          ? `O pagamento de ${payment.client} foi marcado como pendente`
          : `O pagamento de ${payment.client} foi marcado como concluído`,
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.type) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const id = Math.max(...categories.map(c => c.id), 0) + 1;
    const completeCategory = {
      ...newCategory,
      id,
    } as Category;

    setCategories([...categories, completeCategory]);
    
    toast({
      title: "Categoria adicionada",
      description: `${completeCategory.name} foi adicionada com sucesso.`,
    });

    // Reset form and close dialog
    setNewCategory({
      name: '',
      type: 'receivable'
    });
    setIsCategoryDialogOpen(false);
  };

  const handleDeleteCategory = (id: number) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    // Check if category is being used in any payment
    const isUsed = payments.some(p => p.category === categoryToDelete.name);
    if (isUsed) {
      toast({
        title: "Não é possível excluir",
        description: "Esta categoria está sendo usada em um ou mais pagamentos.",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.filter(c => c.id !== id));
    toast({
      title: "Categoria removida",
      description: `${categoryToDelete.name} foi removida com sucesso.`,
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setNewPayment({...newPayment, paymentMethod: value});
    
    // Reset installments when payment method changes
    if (value !== 'Cartão de Crédito') {
      setNewPayment({
        ...newPayment, 
        paymentMethod: value,
        totalInstallments: 1,
        feePercentage: 0,
        feeAmount: 0
      });
      setInstallments([]);
      installmentDates.current = [];
    }
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod) {
      toast({
        title: "Campo vazio",
        description: "Digite um nome para a forma de pagamento.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethods.includes(newPaymentMethod)) {
      toast({
        title: "Forma de pagamento já existe",
        description: "Essa forma de pagamento já está cadastrada.",
        variant: "destructive",
      });
      return;
    }

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setNewPaymentMethod('');
    setIsPaymentMethodDialogOpen(false);
    
    toast({
      title: "Forma de pagamento adicionada",
      description: `${newPaymentMethod} foi adicionado com sucesso.`,
    });
  };
  
  const calculateInstallments = () => {
    if (!newPayment.amount || !newPayment.totalInstallments || newPayment.totalInstallments < 1) {
      toast({
        title: "Dados incompletos",
        description: "Informe o valor e o número de parcelas.",
        variant: "destructive",
      });
      return;
    }
    
    const amount = Number(newPayment.amount);
    const numInstallments = Number(newPayment.totalInstallments);
    const installmentAmount = amount / numInstallments;
    
    // Calculate fee if applicable
    let feeAmount = 0;
    if (newPayment.feeType === 'percentage' && newPayment.feePercentage) {
      feeAmount = (amount * Number(newPayment.feePercentage)) / 100;
    } else if (newPayment.feeType === 'fixed' && newPayment.feeAmount) {
      feeAmount = Number(newPayment.feeAmount);
    }
    
    const baseDate = new Date(newPayment.dueDate || new Date());
    const newInstallments: Installment[] = [];
    const newDates: string[] = [];
    
    for (let i = 0; i < numInstallments; i++) {
      const installmentDate = new Date(baseDate);
      installmentDate.setMonth(baseDate.getMonth() + i);
      
      const dateString = installmentDate.toISOString().split('T')[0];
      newDates[i] = dateString;
      
      newInstallments.push({
        number: i + 1,
        amount: installmentAmount,
        dueDate: dateString,
        status: 'pending'
      });
    }
    
    setInstallments(newInstallments);
    installmentDates.current = newDates;
    
    setNewPayment({
      ...newPayment,
      feeAmount
    });
    
    toast({
      title: "Parcelas calculadas",
      description: `${numInstallments} parcelas de R$ ${installmentAmount.toFixed(2)}`,
    });
  };
  
  const updateInstallmentDate = (index: number, date: Date) => {
    const newDates = [...installmentDates.current];
    newDates[index] = date.toISOString().split('T')[0];
    installmentDates.current = newDates;
    
    const newInstallments = [...installments];
    newInstallments[index] = {
      ...newInstallments[index],
      dueDate: newDates[index]
    };
    
    setInstallments(newInstallments);
  };

  const handleAddNewPayment = () => {
    if (!newPayment.client || !newPayment.category || !newPayment.amount || !newPayment.dueDate || !newPayment.paymentMethod) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const id = Math.max(...payments.map(p => p.id), 0) + 1;
    let completePayment: Payment = {
      ...newPayment as Payment,
      id,
      service: newPayment.category || '',
      amount: Number(newPayment.amount),
      status: 'pending' as PaymentStatus
    };
    
    // Handle installments for credit card payments
    if (newPayment.paymentMethod === 'Cartão de Crédito' && newPayment.totalInstallments && newPayment.totalInstallments > 1) {
      const updatedInstallments = installments.map((inst, index) => ({
        ...inst,
        dueDate: installmentDates.current[index] || inst.dueDate
      }));
      
      completePayment = {
        ...completePayment,
        installments: updatedInstallments,
      };
    }

    setPayments([...payments, completePayment]);
    
    toast({
      title: newPayment.type === 'receivable' ? "Conta a receber adicionada" : "Conta a pagar adicionada",
      description: `${newPayment.client} - ${newPayment.category} (R$ ${Number(newPayment.amount).toLocaleString()})`,
    });

    // Add client to list if it doesn't exist
    if (!clients.includes(newPayment.client!)) {
      setClients([...clients, newPayment.client!]);
    }

    // Reset form and close dialog
    setNewPayment({
      client: '',
      service: '',
      category: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      type: 'receivable',
      paymentMethod: 'Dinheiro',
      totalInstallments: 1,
      feeType: 'percentage',
      feePercentage: 0,
      feeAmount: 0
    });
    setInstallments([]);
    installmentDates.current = [];
    setIsAddDialogOpen(false);
  };
  
  // Editar pagamento
  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setIsEditDialogOpen(true);
  };
  
  // Salvar edição de pagamento
  const handleSaveEditPayment = () => {
    if (!editingPayment) return;
    
    setPayments(payments.map(p => 
      p.id === editingPayment.id ? editingPayment : p
    ));
    
    toast({
      title: "Pagamento atualizado",
      description: `Os dados do pagamento foram atualizados com sucesso.`,
    });
    
    setIsEditDialogOpen(false);
    setEditingPayment(null);
  };
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  // Exportar para PDF
  const handleExportPDF = () => {
    // Simulação de exportação para PDF
    toast({
      title: "Exportação iniciada",
      description: "O arquivo PDF está sendo gerado e será baixado em breve.",
    });
    
    // Simular delay de processamento
    setTimeout(() => {
      toast({
        title: "PDF exportado com sucesso",
        description: "O arquivo foi salvo na pasta de downloads.",
      });
      setIsExportDialogOpen(false);
    }, 1500);
  };
  
  const filteredPayments = payments.filter(payment => {
    // Aplicar filtro de busca
    const matchesSearch = 
      payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.category && payment.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Aplicar filtro de categoria (se não for 'all')
    const matchesCategory = 
      categoryFilter === 'all' || 
      payment.category === categoryFilter;
    
    // Aplicar filtro de mês (se não for 'all')
    const matchesMonth = 
      monthFilter === 'all' || 
      (payment.dueDate && payment.dueDate.substring(5, 7) === monthFilter);
    
    // Se temos um filtro ativo do dashboard, aplicá-lo
    if (activeFilter) {
      switch (activeFilter) {
        case 'receivable-pending':
          return matchesSearch && matchesCategory && matchesMonth && payment.type === 'receivable' && payment.status === 'pending';
        case 'receivable-completed':
          return matchesSearch && matchesCategory && matchesMonth && payment.type === 'receivable' && payment.status === 'completed';
        case 'payable-pending':
          return matchesSearch && matchesCategory && matchesMonth && payment.type === 'payable' && payment.status === 'pending';
        case 'payable-completed':
          return matchesSearch && matchesCategory && matchesMonth && payment.type === 'payable' && payment.status === 'completed';
        default:
          return matchesSearch && matchesCategory && matchesMonth;
      }
    }
    
    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Calculate financial summary
  const financialSummary = {
    receivable: {
      pending: {
        total: payments
          .filter(p => p.type === 'receivable' && p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'receivable' && p.status === 'pending').length
      },
      completed: {
        total: payments
          .filter(p => p.type === 'receivable' && p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'receivable' && p.status === 'completed').length
      }
    },
    payable: {
      pending: {
        total: payments
          .filter(p => p.type === 'payable' && p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'payable' && p.status === 'pending').length
      },
      completed: {
        total: payments
          .filter(p => p.type === 'payable' && p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        count: payments.filter(p => p.type === 'payable' && p.status === 'completed').length
      }
    },
    fees: {
      total: payments
        .filter(p => p.feeAmount)
        .reduce((sum, p) => sum + (p.feeAmount || 0), 0)
    }
  };

  // Handle dashboard card click
  const handleCardClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    
    const filterNames = {
      'receivable-pending': 'Contas a Receber (Pendentes)',
      'receivable-completed': 'Contas a Receber (Concluídos)',
      'payable-pending': 'Contas a Pagar (Pendentes)',
      'payable-completed': 'Contas a Pagar (Concluídos)'
    };
    
    if (activeFilter !== filter) {
      toast({
        title: "Filtro aplicado",
        description: `Exibindo ${filterNames[filter as keyof typeof filterNames]}`,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex w-full bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Pagamentos</h1>
              <p className="text-muted-foreground">Gerencie os pagamentos de seus clientes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-studio-orange hover:bg-studio-orange/90 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Criar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border border-studio-gray sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar novo pagamento</DialogTitle>
                    <DialogDescription>
                      Preencha os dados abaixo para adicionar um novo pagamento ao sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="payment-type">Tipo</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={newPayment.type === 'receivable' ? 'default' : 'outline'}
                          className={newPayment.type === 'receivable' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => setNewPayment({...newPayment, type: 'receivable', category: ''})}
                        >
                          <ArrowUpIcon className="h-4 w-4 mr-2" /> Conta a Receber
                        </Button>
                        <Button
                          type="button"
                          variant={newPayment.type === 'payable' ? 'default' : 'outline'}
                          className={newPayment.type === 'payable' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => setNewPayment({...newPayment, type: 'payable', category: ''})}
                        >
                          <ArrowDownIcon className="h-4 w-4 mr-2" /> Conta a Pagar
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">
                        {newPayment.type === 'receivable' ? 'Cliente' : 'Fornecedor/Despesa'}
                      </Label>
                      <Select 
                        value={newPayment.client} 
                        onValueChange={(value) => setNewPayment({...newPayment, client: value})}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client, index) => (
                            <SelectItem key={index} value={client}>{client}</SelectItem>
                          ))}
                          <SelectItem value="new">+ Adicionar Novo</SelectItem>
                        </SelectContent>
                      </Select>
                      {newPayment.client === 'new' && (
                        <Input
                          placeholder="Nome do cliente/fornecedor"
                          value=""
                          onChange={(e) => setNewPayment({...newPayment, client: e.target.value})}
                          className="mt-2 bg-studio-gray border-studio-gray"
                        />
                      )}
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="category">
                          {newPayment.type === 'receivable' ? 'Categoria/Serviço' : 'Categoria'}
                        </Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsCategoryDialogOpen(true)}
                          className="h-6 text-xs"
                        >
                          Gerenciar Categorias
                        </Button>
                      </div>
                      <Select 
                        value={newPayment.category} 
                        onValueChange={(value) => setNewPayment({...newPayment, category: value})}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(cat => cat.type === newPayment.type)
                            .map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Valor (R$)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newPayment.amount || ''}
                        onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                        className="bg-studio-gray border-studio-gray"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Data de Vencimento</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newPayment.dueDate}
                        onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                        className="bg-studio-gray border-studio-gray"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsPaymentMethodDialogOpen(true)}
                          className="h-6 text-xs"
                        >
                          Adicionar Nova
                        </Button>
                      </div>
                      <Select 
                        value={newPayment.paymentMethod} 
                        onValueChange={handlePaymentMethodChange}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione uma forma de pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method, idx) => (
                            <SelectItem key={idx} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newPayment.paymentMethod === 'Cartão de Crédito' && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="totalInstallments">Parcelamento</Label>
                          <div className="flex gap-2">
                            <Input
                              id="totalInstallments"
                              type="number"
                              min="1"
                              max="24"
                              value={newPayment.totalInstallments || 1}
                              onChange={(e) => setNewPayment({...newPayment, totalInstallments: Number(e.target.value)})}
                              className="bg-studio-gray border-studio-gray w-24"
                            />
                            <Button 
                              type="button" 
                              onClick={calculateInstallments}
                              className="bg-studio-gray hover:bg-studio-gray/90"
                            >
                              Calcular Parcelas
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="feeType">Tipo de Taxa</Label>
                            <Select 
                              value={newPayment.feeType} 
                              onValueChange={(value: FeeType) => setNewPayment({...newPayment, feeType: value})}
                            >
                              <SelectTrigger className="bg-studio-gray border-studio-gray">
                                <SelectValue placeholder="Tipo de taxa" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentual (%)</SelectItem>
                                <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="feeValue">
                              {newPayment.feeType === 'percentage' ? 'Taxa (%)' : 'Valor da Taxa (R$)'}
                            </Label>
                            <Input
                              id="feeValue"
                              type="number"
                              value={newPayment.feeType === 'percentage' 
                                ? newPayment.feePercentage || '' 
                                : newPayment.feeAmount || ''}
                              onChange={(e) => newPayment.feeType === 'percentage'
                                ? setNewPayment({...newPayment, feePercentage: Number(e.target.value)})
                                : setNewPayment({...newPayment, feeAmount: Number(e.target.value)})
                              }
                              className="bg-studio-gray border-studio-gray"
                            />
                          </div>
                        </div>
                        
                        {installments.length > 0 && (
                          <div className="grid gap-2 mt-4">
                            <Label>Datas das Parcelas</Label>
                            <div className="bg-studio-gray/30 rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                              {installments.map((installment, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <span className="text-sm">
                                    Parcela {installment.number}: R$ {installment.amount.toFixed(2)}
                                  </span>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="border-studio-gray bg-studio-gray/50 w-[140px] justify-start text-left font-normal"
                                      >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {installmentDates.current[idx] 
                                          ? formatDate(installmentDates.current[idx]) 
                                          : formatDate(installment.dueDate)}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <CalendarComponent
                                        mode="single"
                                        selected={new Date(installmentDates.current[idx] || installment.dueDate)}
                                        onSelect={(date) => date && updateInstallmentDate(idx, date)}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                              
                              {newPayment.feeAmount && newPayment.feeAmount > 0 && (
                                <div className="flex items-center justify-between text-yellow-400 border-t border-studio-gray pt-2 mt-2">
                                  <span className="text-sm flex items-center">
                                    <Percent className="h-4 w-4 mr-1" />
                                    Taxa da Maquininha:
                                  </span>
                                  <span>R$ {newPayment.feeAmount.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="button" onClick={handleAddNewPayment} className="bg-studio-orange hover:bg-studio-orange/90">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dialog para exportar para PDF */}
              <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="export">
                    <FileText className="h-4 w-4 mr-2" /> Exportar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border border-studio-gray sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Exportar Pagamentos</DialogTitle>
                    <DialogDescription>
                      Configure os parâmetros para exportar os pagamentos em PDF.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="exportMonth">Mês</Label>
                      <Select 
                        value={exportMonth} 
                        onValueChange={setExportMonth}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione o mês" />
                        </SelectTrigger>
                        <SelectContent>
                          {monthOptions.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="exportType">Tipo de Pagamento</Label>
                      <Select 
                        value={exportType} 
                        onValueChange={setExportType}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="receivable">Contas a Receber</SelectItem>
                          <SelectItem value="payable">Contas a Pagar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="exportCategory">Categoria</Label>
                      <Select 
                        value={exportCategory} 
                        onValueChange={setExportCategory}
                      >
                        <SelectTrigger className="bg-studio-gray border-studio-gray">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Layout do Relatório</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="border-studio-gray bg-studio-gray/50 text-center p-4 h-auto justify-center items-center hover:bg-studio-gray/70 hover:text-white"
                        >
                          <div className="flex flex-col items-center">
                            <FileText className="h-8 w-8 mb-2" />
                            <span className="text-xs">Layout Compacto</span>
                          </div>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-studio-gray bg-studio-gray/50 text-center p-4 h-auto justify-center items-center hover:bg-studio-gray/70 hover:text-white"
                        >
                          <div className="flex flex-col items-center">
                            <FileText className="h-8 w-8 mb-2" />
                            <span className="text-xs">Layout Detalhado</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="export" onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-2" /> Exportar PDF
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Dialog para adicionar formas de pagamento */}
              <Dialog open={isPaymentMethodDialogOpen} onOpenChange={setIsPaymentMethodDialogOpen}>
                <DialogContent className="bg-card border border-studio-gray sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Forma de Pagamento</DialogTitle>
                    <DialogDescription>
                      Digite o nome da nova forma de pagamento.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="newPaymentMethod">Nome</Label>
                      <Input
                        id="newPaymentMethod"
                        value={newPaymentMethod}
                        onChange={(e) => setNewPaymentMethod(e.target.value)}
                        placeholder="Ex: Transferência Bancária"
                        className="bg-studio-gray border-studio-gray"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Formas de pagamento existentes:</p>
                      <div className="flex flex-wrap gap-2">
                        {paymentMethods.map((method, idx) => (
                          <div 
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs ${['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX'].includes(method) 
                              ? 'bg-blue-900/20 text-blue-400' 
                              : 'bg-studio-gray/50'}`}
                          >
                            {method}
                            {!['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX'].includes(method) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setPaymentMethods(paymentMethods.filter(m => m !== method))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPaymentMethodDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddPaymentMethod} className="bg-studio-orange hover:bg-studio-orange/90">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Category Management Dialog */}
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="bg-card border border-studio-gray sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Gerenciar Categorias</DialogTitle>
                    <DialogDescription>
                      Adicione ou remova categorias para classificar seus pagamentos.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nova Categoria</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Nome da categoria"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          className="bg-studio-gray border-studio-gray"
                        />
                        <Select 
                          value={newCategory.type} 
                          onValueChange={(value: PaymentType) => setNewCategory({...newCategory, type: value})}
                        >
                          <SelectTrigger className="w-[180px] bg-studio-gray border-studio-gray">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receivable">Contas a Receber</SelectItem>
                            <SelectItem value="payable">Contas a Pagar</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddCategory} size="sm" className="bg-studio-orange hover:bg-studio-orange/90">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Categorias Existentes</Label>
                      <Tabs defaultValue="receivable" className="w-full">
                        <TabsList className="grid grid-cols-2 bg-studio-gray">
                          <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
                          <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
                        </TabsList>
                        <TabsContent value="receivable" className="max-h-[200px] overflow-y-auto mt-2">
                          <div className="space-y-2">
                            {categories.filter(c => c.type === 'receivable').map(category => (
                              <div key={category.id} className="flex items-center justify-between bg-studio-gray/50 p-2 rounded">
                                <span>{category.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="payable" className="max-h-[200px] overflow-y-auto mt-2">
                          <div className="space-y-2">
                            {categories.filter(c => c.type === 'payable').map(category => (
                              <div key={category.id} className="flex items-center justify-between bg-studio-gray/50 p-2 rounded">
                                <span>{category.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsCategoryDialogOpen(false)}>
                      Fechar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Payment Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-card border border-studio-gray sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar Pagamento</DialogTitle>
                    <DialogDescription>
                      Altere os dados do pagamento conforme necessário.
                    </DialogDescription>
                  </DialogHeader>
                  {editingPayment && (
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-client">
                          {editingPayment.type === 'receivable' ? 'Cliente' : 'Fornecedor/Despesa'}
                        </Label>
                        <Input
                          id="edit-client"
                          value={editingPayment.client}
                          onChange={(e) => setEditingPayment({...editingPayment, client: e.target.value})}
                          className="bg-studio-gray border-studio-gray"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-category">Categoria/Serviço</Label>
                        <Select 
                          value={editingPayment.category || editingPayment.service} 
                          onValueChange={(value) => setEditingPayment({...editingPayment, category: value, service: value})}
                        >
                          <SelectTrigger className="bg-studio-gray border-studio-gray">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter(cat => cat.type === editingPayment.type)
                              .map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-amount">Valor (R$)</Label>
                        <Input
                          id="edit-amount"
                          type="number"
                          value={editingPayment.amount}
                          onChange={(e) => setEditingPayment({...editingPayment, amount: Number(e.target.value)})}
                          className="bg-studio-gray border-studio-gray"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
                        <Input
                          id="edit-dueDate"
                          type="date"
                          value={editingPayment.dueDate}
                          onChange={(e) => setEditingPayment({...editingPayment, dueDate: e.target.value})}
                          className="bg-studio-gray border-studio-gray"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select 
                          value={editingPayment.status} 
                          onValueChange={(value: PaymentStatus) => setEditingPayment({...editingPayment, status: value})}
                        >
                          <SelectTrigger className="bg-studio-gray border-studio-gray">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="completed">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-paymentMethod">Forma de Pagamento</Label>
                        <Select 
                          value={editingPayment.paymentMethod || 'Dinheiro'} 
                          onValueChange={(value) => setEditingPayment({...editingPayment, paymentMethod: value})}
                        >
                          <SelectTrigger className="bg-studio-gray border-studio-gray">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method, idx) => (
                              <SelectItem key={idx} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveEditPayment} className="bg-studio-orange hover:bg-studio-orange/90">
                      Salvar Alterações
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>
          
          {/* Financial Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Receber (Pendentes)" 
                data={{
                  total: financialSummary.receivable.pending.total,
                  currency: "R$",
                  count: financialSummary.receivable.pending.count
                }}
                onClick={() => handleCardClick('receivable-pending')}
              />
            </div>
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Receber (Concluídos)" 
                data={{
                  total: financialSummary.receivable.completed.total,
                  currency: "R$",
                  count: financialSummary.receivable.completed.count
                }}
                onClick={() => handleCardClick('receivable-completed')}
              />
            </div>
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Pagar (Pendentes)" 
                data={{
                  total: financialSummary.payable.pending.total,
                  currency: "R$",
                  count: financialSummary.payable.pending.count
                }}
                onClick={() => handleCardClick('payable-pending')}
              />
            </div>
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Contas a Pagar (Concluídos)" 
                data={{
                  total: financialSummary.payable.completed.total,
                  currency: "R$",
                  count: financialSummary.payable.completed.count
                }}
                onClick={() => handleCardClick('payable-completed')}
              />
            </div>
            <div className="bg-card border border-studio-gray rounded-xl p-4">
              <NegotiationCard 
                title="Total de Taxas" 
                data={{
                  total: financialSummary.fees.total,
                  currency: "R$",
                  count: payments.filter(p => p.feeAmount && p.feeAmount > 0).length
                }}
                isHighlighted={true}
              />
            </div>
          </section>
          
          <div className="bg-card rounded-xl border border-studio-gray overflow-hidden">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-studio-gray">
                <TabsList className="bg-studio-gray mb-4 sm:mb-0">
                  <TabsTrigger value="all" onClick={() => setActiveFilter(null)}>Todos</TabsTrigger>
                  <TabsTrigger value="receivable" onClick={() => setActiveFilter(null)}>A Receber</TabsTrigger>
                  <TabsTrigger value="payable" onClick={() => setActiveFilter(null)}>A Pagar</TabsTrigger>
                  <TabsTrigger value="pending" onClick={() => setActiveFilter(null)}>Pendentes</TabsTrigger>
                  <TabsTrigger value="completed" onClick={() => setActiveFilter(null)}>Concluídos</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pagamentos..."
                      className="pl-9 w-full bg-studio-gray border-studio-gray"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="border-studio-gray">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] bg-card border-studio-gray">
                      <DropdownMenuItem className="flex justify-between items-center cursor-default font-medium">
                        <span>Filtros</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={() => {
                            setCategoryFilter('all');
                            setMonthFilter('all');
                          }}
                        >
                          Limpar
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Label className="text-xs mb-1 block">Categoria</Label>
                        <Select 
                          value={categoryFilter} 
                          onValueChange={setCategoryFilter}
                        >
                          <SelectTrigger className="bg-studio-gray border-studio-gray h-8 text-xs">
                            <SelectValue placeholder="Todas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-2">
                        <Label className="text-xs mb-1 block">Mês</Label>
                        <Select 
                          value={monthFilter} 
                          onValueChange={setMonthFilter}
                        >
                          <SelectTrigger className="bg-studio-gray border-studio-gray h-8 text-xs">
                            <SelectValue placeholder="Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            {monthOptions.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <TabsContent value="all" className="p-0">
                <PaymentTable 
                  payments={filteredPayments}
                  handleCompletePayment={handleCompletePayment}
                  handleEditPayment={handleEditPayment}
                  paymentMethods={paymentMethods}
                  categories={categories}
                />
              </TabsContent>
              
              <TabsContent value="receivable" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.type === 'receivable')}
                  handleCompletePayment={handleCompletePayment}
                  handleEditPayment={handleEditPayment}
                  paymentMethods={paymentMethods}
                  categories={categories}
                />
              </TabsContent>
              
              <TabsContent value="payable" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.type === 'payable')}
                  handleCompletePayment={handleCompletePayment}
                  handleEditPayment={handleEditPayment}
                  paymentMethods={paymentMethods}
                  categories={categories}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.status === 'pending')}
                  handleCompletePayment={handleCompletePayment}
                  handleEditPayment={handleEditPayment}
                  paymentMethods={paymentMethods}
                  categories={categories}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="p-0">
                <PaymentTable 
                  payments={filteredPayments.filter(p => p.status === 'completed')}
                  handleCompletePayment={handleCompletePayment}
                  handleEditPayment={handleEditPayment}
                  paymentMethods={paymentMethods}
                  categories={categories}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Active filter indicator */}
          {(activeFilter || categoryFilter !== 'all' || monthFilter !== 'all') && (
            <div className="flex items-center justify-between bg-studio-gray/30 p-2 rounded-lg">
              <span>
                Filtros ativos: {
                  [
                    activeFilter === 'receivable-pending' ? 'Contas a Receber (Pendentes)' : 
                    activeFilter === 'receivable-completed' ? 'Contas a Receber (Concluídos)' :
                    activeFilter === 'payable-pending' ? 'Contas a Pagar (Pendentes)' :
                    activeFilter === 'payable-completed' ? 'Contas a Pagar (Concluídos)' : '',
                    
                    categoryFilter !== 'all' ? `Categoria: ${categoryFilter}` : '',
                    
                    monthFilter !== 'all' ? `Mês: ${monthOptions.find(m => m.value === monthFilter)?.label}` : ''
                  ].filter(Boolean).join(', ')
                }
              </span>
              <Button variant="ghost" size="sm" onClick={() => {
                setActiveFilter(null);
                setCategoryFilter('all');
                setMonthFilter('all');
              }}>
                <X className="h-4 w-4 mr-1" /> Limpar filtros
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Payment Table Component - Extracted to make the main component more manageable
interface PaymentTableProps {
  payments: Payment[];
  handleCompletePayment: (id: number) => void;
  handleEditPayment: (payment: Payment) => void;
  paymentMethods: PaymentMethod[];
  categories: Category[];
}

const PaymentTable = ({ payments, handleCompletePayment, handleEditPayment }: PaymentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-studio-gray/50">
          <tr>
            <th className="text-left p-4">Tipo</th>
            <th className="text-left p-4">Cliente/Fornecedor</th>
            <th className="text-left p-4">Categoria/Serviço</th>
            <th className="text-left p-4">Forma de Pagamento</th>
            <th className="text-left p-4">Valor</th>
            <th className="text-left p-4">Data</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className="border-t border-studio-gray hover:bg-studio-gray/20 transition-colors">
                <td className="p-4">
                  {payment.type === 'receivable' ? (
                    <span className="inline-flex items-center text-green-400">
                      <ArrowUpIcon className="h-4 w-4 mr-1" /> Receber
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-400">
                      <ArrowDownIcon className="h-4 w-4 mr-1" /> Pagar
                    </span>
                  )}
                </td>
                <td className="p-4">{payment.client}</td>
                <td className="p-4">{payment.category || payment.service}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-studio-gray/50">
                    {payment.paymentMethod || 'Dinheiro'}
                  </span>
                  {payment.totalInstallments && payment.totalInstallments > 1 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({payment.totalInstallments}x)
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span>R$ {payment.amount.toLocaleString()}</span>
                    {payment.feeAmount && payment.feeAmount > 0 && (
                      <span className="text-xs text-yellow-400 flex items-center mt-1">
                        <Percent className="h-3 w-3 mr-1" />
                        Taxa: R$ {payment.feeAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  {payment.installments && payment.installments.length > 0 && (
                    <span className="block text-xs text-muted-foreground">
                      + {payment.installments.length - 1} parcelas
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'completed' 
                      ? 'bg-green-900/20 text-green-400' 
                      : 'bg-yellow-900/20 text-yellow-400'
                  }`}>
                    {payment.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCompletePayment(payment.id)}
                      className={`${
                        payment.status === 'completed' 
                          ? 'text-green-400 hover:text-green-500' 
                          : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {payment.status === 'completed' ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditPayment(payment)} 
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-4 text-center text-muted-foreground">
                Nenhum pagamento encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
